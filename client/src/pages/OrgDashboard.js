import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, Heading, Text, Input, Select, Textarea, Button,
  VStack, HStack, useToast, Avatar,
  Stat, StatLabel, StatNumber, StatHelpText
} from '@chakra-ui/react';

export default function OrgDashboard({ user, onLogout }) {
  const toast = useToast();
  const [org, setOrg] = useState(null);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', format: '',
    instagram: '', linkedin: '', linktree: '', tiktok: ''
  });

  const categoryOptions = [
    'astronomy','biology','business','chemistry','computer science','data science',
    'education','engineering','environmental science','history','law','literature',
    'mathematics','medicine','neuroscience','philosophy','physics','political science',
    'psychology','social work','sociology','stem','technology'
  ].sort();
  const formatOptions = ['hybrid','in-person','remote'];

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";
        const res = await axios.get(`${API_BASE}/api/orgs/me/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrg(res.data);
        setFormData({
          name: res.data.name || '',
          description: res.data.location?.description || '',
          category: res.data.category || '',
          format: res.data.format || '',
          instagram: res.data.instagram || '',
          linkedin: res.data.linkedin || '',
          linktree: res.data.linktree || '',
          tiktok: res.data.tiktok || ''
        });

        const reviewRes = await axios.get(`${API_BASE}/api/reviews/orgs/${res.data._id}`);
        setReviews(reviewRes.data);
      } catch (err) {
        toast({
          title: "Failed to load dashboard",
          status: "error",
          duration: 4000,
          isClosable: true
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "https://credimap-backend.onrender.com";
      const res = await axios.put(`${API_BASE}/api/orgs/update-profile`, {
        name: formData.name,
        location: { description: formData.description },
        category: formData.category,
        format: formData.format,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        linktree: formData.linktree,
        tiktok: formData.tiktok
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast({ title: 'Profile updated!', status: 'success', duration: 3000, isClosable: true });
      setEditMode(false);
      setOrg(res.data.user);
    } catch (err) {
      toast({ title: 'Update failed', status: 'error', duration: 4000, isClosable: true });
    }
  };

  if (!org) return <Text>Loading...</Text>;

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, rgb(232,185,171), rgb(214,239,255), rgb(244,226,133))"
      p={8}
      fontFamily="Ubuntu, sans-serif"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading textAlign="left" color="gray.800">
          Your Dashboard
        </Heading>
<Flex align="center" gap={3}>
    {!editMode && (
      <Button colorScheme="yellow" size="sm" onClick={() => setEditMode(true)}>
        Edit
      </Button>
    )}
    <Button colorScheme="blue" size="sm" onClick={() => navigate(`/org/${org._id}`)}>
      Preview Profile
    </Button>
  </Flex>
</Flex>
      

      {editMode ? (
        <VStack spacing={3} align="stretch">
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Organization Name" />
          <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <Select name="category" value={formData.category} onChange={handleChange} placeholder="Category">
            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Select>
          <Select name="format" value={formData.format} onChange={handleChange} placeholder="Format">
            {formatOptions.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
          </Select>
          <Input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram URL" />
          <Input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
          <Input name="linktree" value={formData.linktree} onChange={handleChange} placeholder="Linktree URL" />
          <Input name="tiktok" value={formData.tiktok} onChange={handleChange} placeholder="TikTok URL" />
          <Button colorScheme="blue" w="full" onClick={handleSave}>Save Changes</Button>
        </VStack>
      ) : (
        <>
          {/* Stats Row */}
          <Flex gap={6} mb={10} wrap="wrap">
            {[
              { label: "Avg Rating", value: `${avgRating} ⭐`, help: `Based on ${reviews.length} reviews` },
              { label: "Total Reviews", value: reviews.length, help: "All-time count" },
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

          <Flex gap={8} align="start" wrap="wrap">
            {/* Org Info Card */}
            <Box
              flex="1"
              minW="320px"
              bg="white"
              p={6}
              rounded="2xl"
              shadow="md"
              _hover={{ shadow: "lg" }}
            >
              <Heading size="md" mb={4}>
                {org.name} Info
              </Heading>
              <VStack align="start" spacing={3}>
                <Text><strong>Name:</strong> {org.name}</Text>
                <Text><strong>Description:</strong> {org.location?.description}</Text>
                <Text><strong>Instagram:</strong> {org.instagram ? `@${org.instagram.split("/").filter(Boolean).pop()}` : "N/A"}</Text>
                <Text><strong>Linktree:</strong> {org.linktree ? `@${org.linktree.split("/").filter(Boolean).pop()}` : "N/A"}</Text>
                <Text><strong>LinkedIn:</strong> {org.linkedin ? `@${org.linkedin.split("/").filter(Boolean).pop()}` : "N/A"}</Text>\
                <Text><strong>TikTok:</strong> {org.tiktok ? `@${org.tiktok.split("/").filter(Boolean).pop()}` : "N/A"}</Text>
              </VStack>
            </Box>

            {/* Reviews Card */}
            <Box
              flex="2"
              minW="400px"
              bg="white"
              p={6}
              rounded="2xl"
              shadow="md"
              _hover={{ shadow: "lg" }}
            >
              <Heading size="md" mb={4}>
                Your Reviews
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
          </Flex>
        </>
      )}
    </Box>
  );
}
