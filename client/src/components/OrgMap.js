import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import axios from 'axios';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function OrgMap() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);
  const [hoveredOrgId, setHoveredOrgId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const categoryOptions = [
    'astronomy','biology','business','chemistry','computer science','data science',
    'education','engineering','environmental science','history','law','literature',
    'mathematics','medicine','neuroscience','philosophy','physics','political science',
    'psychology','social work','sociology','stem','technology'
  ].sort();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get('/api/orgs');
        setOrganizations(res.data.filter(o => o?.location?.city));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrgs();
  }, []);

  // Map cities to coordinates
  const getCoords = (org) => {
    if (!org.location?.city) return null;
    const city = org.location.city.toLowerCase();
    const coordsMap = {
      toronto: [-79.3832, 43.6532],
      'new york': [-74.006, 40.7128],
      boston: [-71.0589, 42.3601],
      'san francisco': [-122.4194, 37.7749],
      paris: [2.3514, 48.8575]
    };
    return coordsMap[city] || null;
  };

  // Filtered orgs
  const filteredOrgs = organizations.filter(org => {
    const catMatch = !selectedCategory || org.category?.toLowerCase() === selectedCategory.toLowerCase();
    const formatMatch = !selectedFormat || org.format?.toLowerCase() === selectedFormat.toLowerCase();
    const cityMatch = !selectedCity || org.location?.city === selectedCity;
    return catMatch && formatMatch && cityMatch;
  });

  // Cluster orgs at same coords
  const clusters = {};
  filteredOrgs.forEach(org => {
    const coords = getCoords(org);
    if (!coords) return;
    const key = `${Math.round(coords[0]*2)/2}_${Math.round(coords[1]*2)/2}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(org);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Organization Map</h1>
        {/* <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button> */}
      </header>

      {/* Filters */}
      <div className="p-4 bg-white shadow flex flex-wrap gap-4">
        <select
          className="border px-2 py-1 rounded"
          value={selectedFormat}
          onChange={e => setSelectedFormat(e.target.value)}
        >
          <option value="">All Formats</option>
          <option value="remote">Remote</option>
          <option value="in-person">In-Person</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          className="border px-2 py-1 rounded"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select
          className="border px-2 py-1 rounded"
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {[...new Set(organizations.map(o => o.location?.city).filter(Boolean))].sort().map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <main className="flex-grow relative">
        <ComposableMap projectionConfig={{ scale: 160 }} width={980} height={480}>
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ coordinates, zoom }) => { setCenter(coordinates); setZoom(zoom); }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(g => <Geography key={g.rsmKey} geography={g} fill="#DDD" stroke="#AAA" />)
              }
            </Geographies>

            {/* Render clustered pins */}
            {Object.keys(clusters).map(key => {
              const orgGroup = clusters[key];
              const coords = getCoords(orgGroup[0]);
              if (!coords) return null;

              return orgGroup.map((org, idx) => {
                const angle = (idx / orgGroup.length) * 2 * Math.PI;
                const radius = 1 + (0.1 * zoom);
                const offsetCoords = [coords[0] + Math.cos(angle)*radius, coords[1] + Math.sin(angle)*radius];

                return (
                  <Marker key={org._id} coordinates={offsetCoords}>
                    <g
                      onClick={() => navigate(`/org/${org._id}`)}
                      onMouseEnter={() => setHoveredOrgId(org._id)}
                      onMouseLeave={() => setHoveredOrgId(null)}
                      className="cursor-pointer"
                    >

                    <circle r={4} fill="#e11d48" stroke="#fff" strokeWidth={1}/>
                    {hoveredOrgId === org._id && (
                      <foreignObject x={-50} y={-40} width={100} height={30}>
                        <div className="bg-white text-black text-xs rounded px-2 py-1 shadow text-center">{org.name}</div>
                      </foreignObject>
                    )}

                      {/* Individual tooltip */}
                      {hoveredOrgId === org._id && (
                        <foreignObject x={-50} y={-40} width={100} height={30}>
                          <div className="bg-white text-black text-xs rounded px-2 py-1 shadow text-center">
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
        <div className="fixed top-52 right-4 flex flex-col space-y-2 z-50">
          <button className="bg-white border px-2 py-1 rounded shadow" onClick={() => setZoom(z => Math.min(z*1.5, 8))}>+</button>
          <button className="bg-white border px-2 py-1 rounded shadow" onClick={() => setZoom(z => Math.max(z/1.5, 1))}>-</button>
        </div>
      </main>
    </div>
  );
}
