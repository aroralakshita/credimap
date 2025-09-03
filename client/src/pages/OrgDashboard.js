import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Flex, Heading, Text, Input, Select, Textarea, Button, VStack, HStack, useToast
} from '@chakra-ui/react';

export default function OrgDashboard() {
  const toast = useToast();
  const [org, setOrg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', format: '',
    instagram: '', linkedin: '', linktree: '', tiktok: ''
  });

  const categoryOptions = ['astronomy','biology','business','chemistry','computer science','data science','education','engineering','environmental science','history','law','literature','mathematics','medicine','neuroscience','philosophy','physics','political science','psychology','social work','sociology','stem','technology'].sort();
  const formatOptions = ['hybrid','in-person','remote'];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/orgs/me/dashboard', { headers: { Authorization: `Bearer ${token}` } });
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

        const reviewRes = await axios.get(`/api/reviews/org/${res.data._id}`);
        setReviews(reviewRes.data);
      } catch (err) {
        toast({ title: "Failed to load dashboard", status: "error", duration: 4000, isClosable: true });
      }
    };
    fetchData();
  }, [toast]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`/api/orgs/update-profile`, {
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
    <Flex direction="column" p={6} maxW="4xl" mx="auto" gap={6}>
      <Heading>Org Dashboard</Heading>

      <Box bg="white" p={6} rounded="2xl" shadow="lg" textAlign="left">
        <Flex justify="space-between" mb={4}>
          <Heading size="md" mb={2}>Profile</Heading>
          {!editMode && <Button colorScheme="yellow" size="sm" onClick={() => setEditMode(true)}>Edit</Button>}
        </Flex>

              {editMode ? (
            <>
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
            </>
          ) : (
            <>
              <Text><strong>Name:</strong> {org.name}</Text>
              <Text><strong>Description:</strong> {org.location?.description}</Text>
              <Text><strong>Category:</strong> {org.category}</Text>
              <Text><strong>Format:</strong> {org.format}</Text>
            </>
          )}

      </Box>

      <Box bg="white" p={6} rounded="2xl" shadow="lg">
        <Heading size="md" mb={4}>Reviews</Heading>
        {reviews.length === 0 ? <Text>No reviews yet.</Text> : (
          <VStack spacing={3} align="center">
            {reviews.map(r => (
              <Box key={r._id} p={3} borderWidth={1} borderRadius="md">
                <Text><strong>{r.reviewer?.name}</strong> — {r.rating}★</Text>
                <Text>{r.comment}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
