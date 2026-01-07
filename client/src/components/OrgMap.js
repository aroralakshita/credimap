import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import axios from "axios";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function OrgMap() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);
  const [hoveredOrgId, setHoveredOrgId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const categoryOptions = [
    "STEM", "Arts", "Community Service", "Education", "Environment", 
    "Health", "Technology", "Other"
  ].sort();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";
        const res = await axios.get(`${API_BASE}/api/orgs`);
        
        console.log('=== FETCHED ORGS ===');
        console.log('Total orgs:', res.data.length);
        
        // Log each org's coordinates
        res.data.forEach(org => {
          console.log(`${org.name}:`, {
            city: org.location?.city,
            coords: org.location?.coordinates,
            hasCoords: !!org.location?.coordinates
          });
        });

        setOrganizations(res.data);
      } catch (err) {
        console.error("Error fetching orgs:", err);
      }
    };
    fetchOrgs();
  }, []);

  const filteredOrgs = organizations.filter((org) => {
    // Only show orgs with valid coordinates
    if (!org.location?.coordinates || org.location.coordinates.length !== 2) {
      return false;
    }

    const catMatch =
      !selectedCategory ||
      org.category?.toLowerCase() === selectedCategory.toLowerCase();
    const formatMatch =
      !selectedFormat ||
      org.format?.toLowerCase() === selectedFormat.toLowerCase();
    const cityMatch =
      !selectedCity || org.location?.city === selectedCity;
    return catMatch && formatMatch && cityMatch;
  });

  console.log('Filtered orgs for display:', filteredOrgs.length);

  // Create clusters for organizations in similar locations
  const clusters = {};
  filteredOrgs.forEach((org) => {
    const coords = org.location?.coordinates;
    if (!coords || coords.length !== 2) return;
    
    // Validate coordinates are in valid range
    const [lon, lat] = coords;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      console.warn(`Invalid coordinates for ${org.name}:`, coords);
      return;
    }
    
    const key = `${Math.round(coords[0] * 2) / 2}_${Math.round(coords[1] * 2) / 2}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(org);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-sky-200">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold" style={{ color: "#E8B9AB" }}>
          🌍 Organization Map
        </h1>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">
            Total: {organizations.length}
          </span>
        </div>
      </header>

      {/* Filters floating card */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-4 flex flex-wrap gap-3">
        <select
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          <option value="">All Formats</option>
          <option value="remote">Remote</option>
          <option value="in-person">In-Person</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {[...new Set(organizations.map((o) => o.location?.city).filter(Boolean))]
            .sort()
            .map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
      </div>

      {/* Map */}
      <main className="flex-grow relative">
        <ComposableMap
          projectionConfig={{ scale: 160 }}
          width={980}
          height={480}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ coordinates, zoom }) => {
              setCenter(coordinates);
              setZoom(zoom);
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((g) => (
                  <Geography
                    key={g.rsmKey}
                    geography={g}
                    fill="#E5E7EB"
                    stroke="#9CA3AF"
                  />
                ))
              }
            </Geographies>

            {Object.keys(clusters).map((key) => {
              const orgGroup = clusters[key];
              const coords = orgGroup[0].location?.coordinates;
              if (!coords) return null;

              return orgGroup.map((org, idx) => {
                const angle = (idx / orgGroup.length) * 2 * Math.PI;
                const radius = 1 + 0.1 * zoom;
                const offsetCoords = [
                  coords[0] + Math.cos(angle) * radius,
                  coords[1] + Math.sin(angle) * radius,
                ];

                return (
                  <Marker key={org._id} coordinates={offsetCoords}>
                    <g
                      onClick={() => navigate(`/org/${org._id}`)}
                      onMouseEnter={() => setHoveredOrgId(org._id)}
                      onMouseLeave={() => setHoveredOrgId(null)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      <circle
                        r={5}
                        fill="#d30000"
                        stroke="#fff"
                        strokeWidth={1.5}
                        className="animate-pulse"
                      />
                      {hoveredOrgId === org._id && (
                        <foreignObject x={-60} y={-50} width={120} height={40}>
                          <div className="bg-white text-black text-xs rounded-lg px-3 py-1 shadow-md text-center">
                            {org.name}
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  </Marker>
                );
              });
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom Controls */}
        <div className="fixed bottom-8 right-8 flex flex-col space-y-3 z-50">
          <button
            className="w-10 h-10 rounded-full shadow-md bg-[#E8B9AB] hover:bg-amber-300 transition flex items-center justify-center text-white"
            onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
          >
            +
          </button>
          <button
            className="w-10 h-10 rounded-full shadow-md bg-[#E8B9AB] hover:bg-amber-300 transition flex items-center justify-center text-white"
            onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
          >
            –
          </button>
        </div>
      </main>
    </div>
  );
}