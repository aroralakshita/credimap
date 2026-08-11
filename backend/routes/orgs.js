// routes/orgs.js
const axios = require('axios');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken.js');
const optionalAuth = require('../middleware/optionalAuth.js');
const Org = require('../models/orgs.js');

async function geocodeLocation(city, state, country) {
  if (!city && !state && !country) return null;
  
  const params = {
    format: 'json',
    limit: 1,
    addressdetails: 1
  };

  if (city) params.city = city;
  if (state) params.state = state;
  if (country) params.country = country;
  
  if (country && !city && !state) {
    params.featuretype = 'country';
  }
  
  const locationString = [city, state, country].filter(Boolean).join(", ");
  
  try {
    console.log(`  Attempting to geocode: "${locationString}"`);
    
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params,
        headers: {
          'User-Agent': 'CrediMap Organization Mapper'
        },
        timeout: 5000
      }
    );

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const coords = [
        parseFloat(result.lon),
        parseFloat(result.lat)
      ];

      const countryCode = result.address?.country_code
        ? result.address.country_code.toUpperCase()
        : null;
      console.log(`  Geocoded successfully: [${coords[0]}, ${coords[1]}] (${countryCode})`);
      return { coordinates: coords, countryCode };
    } else {
      console.log(`  No results found for: "${locationString}"`);
    }
  } catch (err) {
    console.error(`  Geocoding error for "${locationString}":`, err.message);
  }

  return null;
}

router.post('/:id/geocode', async (req, res) => {
  try {
    const org = await Org.findById(req.params.id);
    
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (!org.location?.city && !org.location?.state && !org.location?.country) {
      return res.status(400).json({ message: 'Organization has no location data' });
    }

    const geoResult = await geocodeLocation(
      org.location.city,
      org.location.state,
      org.location.country
    );

    if (geoResult) {
      org.location.coordinates = geoResult.coordinates;
      org.location.countryCode = geoResult.countryCode;
      await org.save();
      
      res.json({ 
        message: 'Geocoded successfully',
        org
      });
    } else {
      res.status(404).json({ message: 'Could not geocode location' });
    }

  } catch (err) {
    console.error('Geocoding error:', err);
    res.status(500).json({ message: 'Error geocoding' });
  }
});

// Batch geocode all organizations
router.post('/geocode-all', async (req, res) => {
  try {
    // Find orgs that need geocoding
    const orgs = await Org.find({
      $and: [
        { $or: [
          { 'location.coordinates': { $exists: false } },
          { 'location.coordinates': null },
          { 'location.coordinates': [] },
          { 'location.coordinates': { $size: 0 } }

        ]},
        { $or: [
          { 'location.city': { $exists: true, $ne: '' } },
          { 'location.state': { $exists: true, $ne: '' } },
          { 'location.country': { $exists: true, $ne: '' } }
        ]}
      ]
    });

    console.log(`Found ${orgs.length} orgs to geocode`);

    const results = {
      total: orgs.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (const org of orgs) {
      try {
        console.log(`\nProcessing: ${org.name}`);
        
        const geoResult = await geocodeLocation(
          org.location?.city,
          org.location?.state,
          org.location?.country
        );

        if (geoResult) {
          org.location.coordinates = geoResult.coordinates;
          org.location.countryCode = geoResult.countryCode;
          await org.save();
          results.success++;
          results.details.push({
            name: org.name,
            location: [org.location?.city, org.location?.state, org.location?.country].filter(Boolean).join(", "),
            coordinates: geoResult.coordinates,
            countryCode: geoResult.countryCode,
            status: 'success'
          });
        } else {
          results.failed++;
          results.details.push({
            name: org.name,
            location: [org.location?.city, org.location?.state, org.location?.country].filter(Boolean).join(", "),
            status: 'failed - could not geocode'
          });
        }

        // Rate limit: 1 request per second
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (err) {
        console.error(`Error geocoding ${org.name}:`, err);
        results.failed++;
        results.details.push({
          name: org.name,
          status: 'error',
          error: err.message
        });
      }
    }

    res.json({ 
      message: 'Batch geocoding complete',
      results 
    });

  } catch (err) {
    console.error('Batch geocoding error:', err);
    res.status(500).json({ message: 'Error in batch geocoding' });
  }
});

router.post('/submit', optionalAuth, async (req, res) => {
  try {
    const { name, category, format, description, instagram, linktree, tiktok, linkedin, website, location, submitterName } = req.body;

    // Check if org already exists
    const existingOrg = await Org.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingOrg) {
      return res.status(400).json({ 
        message: 'An organization with this name already exists' 
      });
    }

    let geoResult = null;
    if (location?.city || location?.state || location?.country) {
      console.log('Geocoding location:', location);
      geoResult = await geocodeLocation(location.city, location.state, location.country);
      console.log('Result:', geoResult);
    }

    // Create new org
    const org = new Org({
      name,
      category,
      format,
      description,
      instagram,
      linktree,
      tiktok,
      linkedin,
      website,
      location: {
        city: location?.city,
        state: location?.state,
        country: location?.country,
        coordinates: geoResult?.coordinates || null,
        countryCode: geoResult?.countryCode || null,
      },
      submittedBy: {
        name: submitterName,
        userId: req.user?.id || null
      },
      status: 'pending'
    });

    await org.save();
    console.log('✅ Org saved:', org._id, 'with coordinates:', geoResult?.coordinates);

    res.status(201).json({ 
      message: 'Organization submitted successfully!',
      org 
    });
  } catch (err) {
    console.error('Error submitting org:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orgs - Get all orgs
router.get('/', async (req, res) => {
  try {
    const { category, format, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (format) query.format = format;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const orgs = await Org.find(query)
      .populate('reviews')
      .sort({ createdAt: -1 });

    
    console.log(`Found ${orgs.length} orgs, ${orgs.filter(o => o.location?.coordinates).length} with coordinates`);
    
    res.json(orgs);
  } catch (err) {
    console.error('Error fetching orgs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orgs/:id - Get single org
router.get('/:id', async (req, res) => {
  try {
    const org = await Org.findById(req.params.id)
      .populate('reviews');

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(org);
  } catch (err) {
    console.error('Error fetching org:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;