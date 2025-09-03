import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaLink, FaTiktok } from "react-icons/fa";
import axios from 'axios';

function OrgProfile() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false); // to trigger re-fetch
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgAndReviews = async () => {
      try {
        const orgRes = await axios.get(`/api/orgs/${id}`);
        console.log("Fetched org data:", orgRes.data);
        setOrg(orgRes.data);
        
        const reviewRes = await axios.get(`/api/reviews/org/${id}`);
        setReviews(reviewRes.data);

        const avgRes = await axios.get(`/api/reviews/org/${id}/average`);
        setAverage(avgRes.data.average.toFixed(1));
      } catch (err) {
      console.error(err);
    }
  };

    fetchOrgAndReviews();
  }, [id, refresh, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to submit a review.');

    try {
      await axios.post(`/api/reviews/org/${id}`, {
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRating(0);
      setComment('');
      setRefresh(prev => !prev); // trigger re-fetch
    } catch (err) {
      alert('Failed to submit review.');
      console.error(err);
    }
  };

  if (!org) return <div className="text-center p-10">Loading organization...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        className="mb-4 text-blue-600 underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold">{org.name}</h1>
        <p className="text-gray-600 italic">{org.location?.city}, {org.location?.country || 'Location unknown'}</p>
      
      <div className="flex space-x-4 mt-3">
  {org.instagram && (
    <a
      href={org.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-600 hover:text-pink-700 text-2xl"
    >
      <FaInstagram />
    </a>
  )}
  {org.linkedin && (
    <a
      href={org.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-700 hover:text-blue-800 text-2xl"
    >
      <FaLinkedin />
    </a>
  )}
  {org.linktree && (
    <a
      href={org.linktree}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:text-green-700 text-2xl"
    >
      <FaLink />
    </a>
  )}
  {org.tiktok && (
    <a
      href={org.tiktok}
      target="_blank"
      rel="noopener noreferrer"
      className="text-black hover:text-gray-800 text-2xl"
    >
      <FaTiktok />
    </a>
  )}
</div>

      
      <div className="mt-2 flex flex-wrap gap-2">
        {org.category && (
         <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
        {org.category}
         </span>
      )}
        {org.format && (
         <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        {org.format}
         </span>
      )}
      </div>

      <div className="mt-4">
        <p className="text-xl">⭐ {average} / 5</p>
      {reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      )}

        {org.logoUrl && (
          <img src={org.logoUrl} alt={`${org.name} logo`} className="w-40 h-40 mt-4 rounded object-cover" />
        )}

        <p className="mt-4 text-gray-800">{org.location?.description || "No description available."}</p>
        
        {/* Placeholder for reviews */}
        <hr className="my-6" />
        <h2 className="text-xl font-semibold">Reviews</h2>
        <ul className="mt-6 space-y-2">
          {reviews.map(r => (
            <li key={r._id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{r.reviewer.name} — {r.rating}★</p>
              <p>{r.comment}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-4 rounded shadow">
          <div className="mb-2">
            <label className="block font-semibold mb-1">Your Rating</label>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >★</button>
            ))}
          </div>

          <textarea
            className="w-full border rounded p-2 mb-2"
            placeholder="Write a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default OrgProfile;