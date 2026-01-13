const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// ===== CONFIG =====
const PORT = 3000;
const HUBSPOT_BASE_URL = 'https://api.hubspot.com/crm/v3';
const CUSTOM_OBJECT_ID = '2-54742785'; // Games Custom Object ID
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// ===== APP SETUP =====
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== HUBSPOT CLIENT =====
const hubspotClient = axios.create({
  baseURL: HUBSPOT_BASE_URL,
  headers: {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  },
});

// ===== ROUTE 1: HOMEPAGE (GET) =====
app.get('/', async (req, res) => {
  try {
    // Requesting specifically the properties we need for our cards
    const response = await hubspotClient.get(
      `/objects/${CUSTOM_OBJECT_ID}`,
      { params: { properties: 'name,publisher,price' } }
    );

    res.render('homepage', {
      title: 'Games Directory | HubSpot Integration',
      data: response.data.results || [],
    });
  } catch (err) {
    console.error("Fetch Error:", err.response?.data || err.message);
    res.render('homepage', {
      title: 'Games Directory | HubSpot Integration',
      data: [],
      error: 'Failed to load games from HubSpot.',
    });
  }
});

// ===== ROUTE 2: FORM PAGE (GET) =====
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Add New Game | HubSpot',
  });
});

// ===== ROUTE 3: FORM SUBMIT (POST) =====
app.post('/update-cobj', async (req, res) => {
  const { name, publisher, price } = req.body;

  // Validation
  if (!name || !publisher || !price) {
    return res.status(400).render('updates', {
      title: 'Add New Game | HubSpot',
      error: 'Please fill in all fields.',
      old: req.body,
    });
  }

  try {
    // Note: HubSpot expects properties as strings or numbers. 
    // We send them inside the 'properties' object.
    await hubspotClient.post(`/objects/${CUSTOM_OBJECT_ID}`, {
      properties: {
        name: name,
        publisher: publisher,
        price: price.toString(), // HubSpot often prefers numeric properties as strings in POST
      },
    });

    res.redirect('/');
  } catch (err) {
    console.error("Post Error:", err.response?.data || err.message);
    res.status(500).render('updates', {
      title: 'Add New Game | HubSpot',
      error: 'Could not save to HubSpot. Please check your property names.',
      old: req.body,
    });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});