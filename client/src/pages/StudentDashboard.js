import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user?.role !== "student") return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/reviews?studentId=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#E8B9AB] via-[#D6EFFF] to-[#F4E285] p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-lg text-gray-700 mb-6">
            You are logged in as <span className="font-semibold">{user?.role}</span>
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/orgmap")}
              className="bg-[#E8B9AB] hover:bg-sky-200 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
            >
              Explore Organizations
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">You haven’t submitted any reviews yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {reviews.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-tr from-[#F4E285] via-[#D6EFFF] to-[#E8B9AB] p-5 rounded-2xl shadow-lg border border-gray-200 transition hover:scale-105"
                >
                  <h3 className="font-bold text-lg mb-2">{r.orgName}</h3>
                  <p className="mb-2 text-yellow-600 font-semibold">
                    {"⭐".repeat(r.rating)}
                  </p>
                  <p className="text-gray-700">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
