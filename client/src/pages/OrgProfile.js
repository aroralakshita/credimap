import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Flex, Heading, Text, VStack, HStack, Avatar, Stat, StatLabel, StatNumber, StatHelpText, IconButton, Spinner
} from '@chakra-ui/react';
import { FaInstagram, FaLinkedin, FaLink, FaTiktok } from 'react-icons/fa';

export default function OrgProfile() {
  const { orgId } = useParams(); // 👈 get orgId from route like /orgprofile/:orgId
  const [org, setOrg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false); // to trigger re-fetch
  const [average, setAverage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();


  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

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
            <p className="text-gray-100 italic text-2xl">{org.location?.city}, {org.location?.country || 'Location unknown'}</p>
          </Heading>

          {/* Social Media beside name */}
          <div className="flex space-x-4 mb-6">
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
        </HStack>
      </Flex>

      {/* Stats Row */}
      <Flex gap={6} mb={10} wrap="wrap">
        {[
          { label: "Avg Rating", value: `${avgRating} ⭐`, help: `Based on ${reviews.length} reviews` },
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
        <Box
          flex="2"
          minW="200px"
          bg="white"
          p={6}
          rounded="2xl"
          shadow="md"
          _hover={{ shadow: "lg" }}
        >
          <Heading size="md" mb={4}>
            Reviews
          </Heading>
          {reviews.length === 0 ? (
            <Text>No reviews yet.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {reviews.map(r => (
                <Box
                  key={r._id}
                  p={4}
                  bg="gray.50"
                  rounded="lg"
                  shadow="sm"
                  _hover={{ bg: "gray.100" }}
                >
                  <HStack spacing={3} mb={2}>
                    <Avatar size="sm" name={r.reviewer?.name || "User"} />
                    <Text fontWeight="bold">{r.reviewer?.name || "Anonymous"}</Text>
                    <Text color="yellow.500">{r.rating}⭐</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700">
                    {r.comment}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Listings */}
        <Box
          flex="1"
          minW="525px"
          bg="white"
          p={6}
          rounded="2xl"
          shadow="md"
          _hover={{ shadow: "lg" }}
        >
          <Heading size="md" mb={4}>
            Listings
          </Heading>
          {listings.length === 0 ? (
            <Text>No listings available.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {listings.map(l => (
                <Box
                  key={l._id}
                  p={4}
                  bg="gray.50"
                  rounded="lg"
                  shadow="sm"
                  _hover={{ bg: "gray.100" }}
                >
                  <Text fontWeight="bold">{l.title}</Text>
                  <Text fontSize="sm" color="gray.700">{l.description}</Text>
                  <Text fontSize="xs" color="gray.500">{l.type} • {l.date}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
