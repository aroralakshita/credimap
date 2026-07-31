import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ColdStartNotice from "./ColdStartNotice";

export default function OrgList() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" = A-Z, "desc" = Z-A
  const [loading, setLoading] = useState(true);

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

  const sortedOrgs = [...organizations].sort((a, b) => {
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
            🗂️ Browse Organizations
          </h1>
          <button
            onClick={toggleSort}
            className="bg-white shadow-md border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Sort: {sortDirection === "asc" ? "A → Z" : "Z → A"}
          </button>
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