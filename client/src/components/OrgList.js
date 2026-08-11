import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ColdStartNotice from "./ColdStartNotice";
import { getContinent, CONTINENT_OPTIONS } from "../utils/continents";

const categoryOptions = [
  'Astronomy','Arts','Biology','Business','Chemistry','Computer science','Community service', 'Cybersecurity', 'Data science',
  'Education','Engineering','Environmental science','History','Law','Literature',
  'Mathematics','Medicine','Neuroscience','Philosophy','Physics','Political science',
  'Psychology','Social work','Sociology','STEM','Technology'
].sort();

export default function OrgList() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" = A-Z, "desc" = Z-A
  const [loading, setLoading] = useState(true);

  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";
        const res = await axios.get(`${API_BASE}/api/orgs`);
        setOrganizations(res.data);
      } catch (err) {
        console.error("Error fetching orgs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const filteredOrgs = organizations.filter((org) => {
    const formatMatch = !selectedFormat || org.format?.toLowerCase() === selectedFormat.toLowerCase();
    const categoryMatch = !selectedCategory || org.category?.toLowerCase() === selectedCategory.toLowerCase();
    const continentMatch =
      !selectedContinent || getContinent(org.location?.countryCode) === selectedContinent;
    return formatMatch && categoryMatch && continentMatch;
  });

  const sortedOrgs = [...filteredOrgs].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
    if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-200">
      <ColdStartNotice />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: "#E8B9AB" }}>
            Browse Organizations
          </h1>
          <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-blue-500 text-white px-3 py-2 rounded-lg text-sm"
            >
              {showFilters ? "Hide Filters" : "Filters"}
          </button>
          <button
            onClick={toggleSort}
            className="bg-white shadow-md border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Sort: {sortDirection === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      {/* Filters */}
        <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-2 mb-6 bg-white/95 shadow-md rounded-xl p-3`}>
          <select
            className="border px-2 md:px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-auto"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">All Formats</option>
            <option value="remote">Remote</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            className="border px-2 md:px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="border px-2 md:px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-auto"
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
          >
            <option value="">All Continents</option>
            {CONTINENT_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading organizations...</p>
        ) : sortedOrgs.length === 0 ? (
          <p className="text-gray-500">No organizations found.</p>
        ) : (
          <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
            {sortedOrgs.map((org) => (
              <li
                key={org._id}
                onClick={() => navigate(`/org/${org._id}`)}
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{org.name}</p>
                  <p className="text-xs text-gray-500">
                    {[org.location?.city, org.location?.state, org.location?.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <span className="text-xs text-gray-400 capitalize">{org.format}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}