import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import axios from 'axios';

// This is a simple world map outline
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const OrgMap = () => {
  const [organizations, setOrganizations] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [center, setCenter] = useState([0, 20]);
  const [hoveredOrgId, setHoveredOrgId] = useState(null);
  const navigate = useNavigate();

const categoryOptions = [
    'astronomy',
    'biology',
    'business',
    'chemistry',
    'computer science',
    'data science',
    'education',
    'engineering',
    'environmental science',
    'history',
    'law',
    'literature',
    'mathematics',
    'medicine',
    'neuroscience',
    'philosophy',
    'physics',
    'political science',
    'psychology',
    'social work',
    'sociology',
    'stem',
    'technology'
  ].sort();

  // This runs once when the page loads — it gets your org data from the backend
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get('/api/orgs');
        setOrganizations(res.data);
        console.log("Fetched orgs:", res.data);

        // Optional: filter out orgs with bad location data
        const validOrgs = res.data.filter(org =>
          org && org.location && typeof org.location.city === 'string'
);

setOrganizations(validOrgs);

      } catch (err) {
        console.error("Error fetching orgs:", err);
      }
    };

fetchOrgs();
}, [setOrganizations]);

  // TEMPORARY: Turn city names into map coordinates manually
const getCoords = (org) => {
  if (!org || !org.location || !org.location.city) return null;

  const city = org.location.city.toLowerCase();
  if (city.includes('toronto')) return [-79.3832, 43.6532];
  if (city.includes('new york')) return [-74.006, 40.7128];
  if (city.includes('boston')) return [-71.0589, 42.3601];
  if (city.includes('san francisco')) return [-122.4194, 37.7749];
  if (city.includes('paris')) return [2.3514, 48.8575];

  return null; // Don't show if unknown
};

const [selectedFormat, setSelectedFormat] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedCity, setSelectedCity] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Organizations Map</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </header>

{/* Filters */}
<div className="p-4 bg-white shadow flex flex-wrap gap-4 justify-start items-center">
  <select
    value={selectedFormat}
    onChange={(e) => setSelectedFormat(e.target.value)}
    className="border px-2 py-1 rounded"
  >
    <option value="">All Formats</option>
    <option value="remote">Remote</option>
    <option value="in-person">In-Person</option>
    <option value="hybrid">Hybrid</option>
  </select>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="border px-2 py-1 rounded"
  >
    <option value="">All Categories</option>
    {categoryOptions.map((cat) => (
      <option key={cat} value={cat}>{cat[0].toUpperCase() + cat.slice(1)}</option>
    ))}
  </select>

  <select
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    className="border px-2 py-1 rounded"
  >
    <option value="">All Locations</option>
    {[...new Set(organizations.map((org) => org.location?.city).filter(Boolean))]
      .sort()
      .map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
  </select>
</div>

      <main className="flex-grow overflow-hidden">
        <div className="relative w-full h-full"></div>
      <ComposableMap projectionConfig={{ scale: 160 }} width={980} height={480}>
        <ZoomableGroup
          zoom={zoomLevel}
          center={center} // Start centered over North America-ish
          onMoveEnd={({ coordinates, zoom }) => {
            // update both zoom and center when dragging or zooming
            setCenter(coordinates);
            setZoomLevel(zoom);
          }}
          maxZoom={8}
          minZoom={0.5}
          translateExtent={[[0, 0], [980, 480]]} // limit dragging to map bounds
>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#AAA"
              />
            ))
          }
        </Geographies>

{(() => {
  const labelGroups = {}; // Keyed by rough coordinates

const normalizedSelectedFormat = selectedFormat.toLowerCase().trim();
const normalizedSelectedCategory = selectedCategory.toLowerCase().trim();

  // Group orgs by approximate lat/lng
for (const org of organizations.filter(org => {
  const orgFormat = org.format?.toLowerCase().trim();
  const orgCategory = org.category?.toLowerCase().trim();
  const orgCity = org.location?.city;

  const matchesFormat =
    !normalizedSelectedFormat || orgFormat === normalizedSelectedFormat;

  const matchesCategory =
    !normalizedSelectedCategory || orgCategory === normalizedSelectedCategory;

  const matchesCity =
    !selectedCity || orgCity === selectedCity;

  return matchesFormat && matchesCategory && matchesCity;
})) {
    const coords = getCoords(org);
    if (!coords) continue;

    const key = `${Math.round(coords[0] * 2) / 2}_${Math.round(coords[1] * 2) / 2}`;
    if (!labelGroups[key]) labelGroups[key] = [];
    labelGroups[key].push({ org, coords });
  }

  const renderedMarkers = [];

  for (const groupKey in labelGroups) {
    const group = labelGroups[groupKey];

    // Determine how many labels to show based on zoom level
    let maxVisible = 1;
    if (zoomLevel > 1.5) maxVisible = 2;
    if (zoomLevel > 2.5) maxVisible = group.length;

group.forEach(({ org, coords }, index) => {
  const [lng, lat] = coords;

  // Radial pattern spread
  const angle = (index / group.length) * 2 * Math.PI;
  const radius = 1.0 + (0.1 * zoomLevel); // distance between pins, scales with zoom

  const offsetLng = Math.cos(angle) * radius;
  const offsetLat = Math.sin(angle) * radius;

  const markerCoord = [lng + offsetLng, lat + offsetLat];

  renderedMarkers.push(
    <Marker key={org._id} coordinates={markerCoord}>
      <g
        onClick={() => navigate(`/org/${org._id}`)}
        className="cursor-pointer group"
        onMouseEnter={() => setHoveredOrgId(org._id)}
        onMouseLeave={() => setHoveredOrgId(null)}
      >
        {/* Pin */}
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="#e11d48"
          stroke="#fff"
          strokeWidth="1"
          transform="scale(0.5) translate(-12, -24)"
        />
        <title>{org.name}</title>

        {/* Label */}
        {(zoomLevel > 1.2 || index === 0) && (
          <foreignObject
            x={-60}
            y={-50}
            width={120}
            height={40}
            className="pointer-events-auto"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              className={`bg-white text-black text-xs rounded px-2 py-1 shadow-md border border-gray-300 text-center w-full overflow-hidden text-ellipsis whitespace-nowrap ${
                hoveredOrgId === org._id ? 'font-semibold' : ''
              }`}
              style={{
                maxWidth: '120px',
                fontSize: '11px',
              }}
            >
              {org.name.length > 40 ? org.name.slice(0, 37) + '…' : org.name}
            </div>
          </foreignObject>
        )}
      </g>
    </Marker>
  );

if (hoveredOrgId) {
  const hovered = renderedMarkers.find(m => m.key === hoveredOrgId);
  if (hovered) {
    // Remove from original position
    const index = renderedMarkers.findIndex(m => m.key === hoveredOrgId);
    renderedMarkers.splice(index, 1);
    // Push at the end (top)
    renderedMarkers.push(hovered);
  }
}
});
  }
  return renderedMarkers;
})()}
            </ZoomableGroup>
      </ComposableMap>
      {/* Zoom Controls */}
  <div className="fixed top-52 right-4 flex flex-col space-y-2 z-50">
    <button
      onClick={() => setZoomLevel((z) => Math.min(z * 1.5, 8))}
      className="bg-white border px-2 py-1 rounded shadow"
    >
      +
    </button>
    <button
      onClick={() => setZoomLevel((z) => Math.max(z / 1.5, 1))}
      className="bg-white border px-2 py-1 rounded shadow"
    >
      -
    </button>
  </div>
       </main>
      </div>
  );
}

export default OrgMap;