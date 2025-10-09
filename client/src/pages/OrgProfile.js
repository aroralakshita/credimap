import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Flex, Heading, Text, VStack, HStack, Avatar,
  Stat, StatLabel, StatNumber, StatHelpText, Button
} from '@chakra-ui/react';
import { FaInstagram, FaLinkedin, FaLink, FaTiktok } from 'react-icons/fa';

export default function OrgProfile({ user }) {
  const { orgId } = useParams();
  const [org, setOrg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [average, setAverage] = useState(0);
  const navigate = useNavigate();

// Show "Back to Dashboard" ONLY if:
// 1️⃣ User is logged in
// 2️⃣ User is an organization
// 3️⃣ This org profile belongs to them
const showBackButton =
  user &&
  org &&
  user && user.role !== "student" &&
  String(user.id) === String(org._id); // <-- userId from backend for ownership



  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const orgRes = await axios.get(`${API_BASE}/api/orgs/${orgId}`);
        setOrg(orgRes.data);

        const reviewRes = await axios.get(`${API_BASE}/api/reviews/orgs/${orgId}`);
        setReviews(reviewRes.data);

        const avgRes = await axios.get(`${API_BASE}/api/reviews/orgs/${orgId}/average`);
        setAverage(avgRes.data.average.toFixed(1));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load organization data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to submit a review.');

    try {
      await axios.post(`${API_BASE}/api/reviews/orgs/${orgId}`, {
  rating: parseInt(rating, 10),
  comment: comment.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRating(0);
      setComment('');
      setRefresh(prev => !prev);
} catch (err) {
  if (err.response) {
    console.error("Backend error:", err.response.data);
    alert(`Failed: ${err.response.data.message || "Server error"}`);
  } else {
    console.error(err);
    alert("Network error submitting review.");
  }
}
  };

  if (loading) return <div className="text-center p-10">Loading organization...</div>;
  if (error) return <div className="text-center p-10">{error}</div>;

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, rgb(232,185,171), rgb(214,239,255), rgb(244,226,133))"
      p={8}
      fontFamily="Ubuntu, sans-serif"
    >

      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={3}>
          <Heading textAlign="left" color="gray.800">
            {org.name}
            <p className="text-gray-100 italic text-2xl">
              {org.location?.city}, {org.location?.country || 'Location unknown'}
            </p>
          </Heading>

          {/* Social Media beside name */}
          <div className="flex space-x-4 mb-6">
            {org.instagram && (
              <a href={org.instagram} target="_blank" rel="noopener noreferrer"
                 className="text-pink-600 hover:text-pink-700 text-2xl">
                <FaInstagram />
              </a>
            )}
            {org.linkedin && (
              <a href={org.linkedin} target="_blank" rel="noopener noreferrer"
                 className="text-blue-700 hover:text-blue-800 text-2xl">
                <FaLinkedin />
              </a>
            )}
            {org.linktree && (
              <a href={org.linktree} target="_blank" rel="noopener noreferrer"
                 className="text-green-600 hover:text-green-700 text-2xl">
                <FaLink />
              </a>
            )}
            {org.tiktok && (
              <a href={org.tiktok} target="_blank" rel="noopener noreferrer"
                 className="text-black hover:text-gray-800 text-2xl">
                <FaTiktok />
              </a>
            )}
          </div>
        </HStack>
              {showBackButton && (
        <Button
          colorScheme="gray"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      )}
      </Flex>

      {/* Stats Row */}
      <Flex gap={6} mb={10} wrap="wrap">
        {[
          { label: "Avg Rating", value: `${average} ⭐`, help: `Based on ${reviews.length} reviews` },
          { label: "Description", help: org.location?.description },
          { label: "Category", value: org.category || "N/A", help: org.format || "" },
        ].map((stat, i) => (
          <Box
            key={i}
            flex="1"
            minW="200px"
            bg="white"
            p={6}
            rounded="2xl"
            shadow="md"
            _hover={{ shadow: "lg" }}
          >
            <Stat>
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber>{stat.value}</StatNumber>
              {stat.help && <StatHelpText>{stat.help}</StatHelpText>}
            </Stat>
          </Box>
        ))}
      </Flex>

      {/* Info + Reviews + Listings */}
      <Flex gap={8} align="start" wrap="wrap">
{/* Reviews */}
<Box flex="2" minW="200px" bg="white" p={6} rounded="2xl" shadow="md" _hover={{ shadow: "lg" }}>
  <Heading size="md" mb={4}>Reviews</Heading>

{/* ✅ Review form (only if user is logged in and not an org owner) */}
{user?.role === "student" && (
  <Box mb={6} p={4} bg="gray.50" rounded="lg" shadow="sm">
    <Heading size="sm" mb={2}>Leave a Review</Heading>
    <form onSubmit={handleSubmit}>
      {/* Star Rating */}
      <HStack spacing={1} mb={3}>
        {[1, 2, 3, 4, 5].map(star => (
          <Button
            key={star}
            type="button"
            size="sm"
            onClick={() => setRating(star)}
            bg={rating >= star ? "yellow.400" : "gray.200"}
            color="black"
            _hover={{ bg: rating >= star ? "yellow.500" : "gray.300" }}
            rounded="full"
            px={2}
          >
            ⭐
          </Button>
        ))}
      </HStack>

      {/* Comment Input */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        rows={3}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontFamily: "inherit"
        }}
      />

      {/* Submit */}
      <Button
        type="submit"
        mt={3}
        colorScheme="blue"
        isDisabled={!rating || !comment.trim()}
      >
        Submit Review
      </Button>
    </form>
  </Box>
)}

  {/* Existing review list */}
  {reviews.length === 0 ? (
    <Text>No reviews yet.</Text>
  ) : (
    <VStack align="stretch" spacing={4}>
      {reviews.map(r => (
        <Box key={r._id} p={4} bg="gray.50" rounded="lg" shadow="sm" _hover={{ bg: "gray.100" }}>
          <HStack spacing={3} mb={2}>
            <Avatar size="sm" name={r.reviewer?.name || "User"} />
            <Text fontWeight="bold">{r.reviewer?.name || "Anonymous"}</Text>
            <Text color="yellow.500">{r.rating}⭐</Text>
          </HStack>
          <Text fontSize="sm" color="gray.700">{r.comment}</Text>
        </Box>
      ))}
    </VStack>
  )}
</Box>

        {/* Listings */}
        {/*<Box flex="1" minW="525px" bg="white" p={6} rounded="2xl" shadow="md" _hover={{ shadow: "lg" }}>
          <Heading size="md" mb={4}>Listings</Heading>
          {listings.length === 0 ? (
            <Text>No listings available.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {listings.map(l => (
                <Box key={l._id} p={4} bg="gray.50" rounded="lg" shadow="sm" _hover={{ bg: "gray.100" }}>
                  <Text fontWeight="bold">{l.title}</Text>
                  <Text fontSize="sm" color="gray.700">{l.description}</Text>
                  <Text fontSize="xs" color="gray.500">{l.type} • {l.date}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>*/}
      </Flex>
    </Box>
  );
}
