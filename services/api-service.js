const axios = require("axios");
require("dotenv").config();

// Fetch locations from OpenTripMap by name
const fetchLocations = async (locationName) => {
  try {
    const response = await axios.get(
      "https://api.opentripmap.com/0.1/en/places/geoname",
      {
        params: {
          name: locationName,
          apikey: process.env.OPENTRIPMAP_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching locations: " + error.message);
  }
};

// Fetch location details by ID
const fetchLocationDetails = async (locationId) => {
  try {
    const response = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/xid/${locationId}`,
      {
        params: {
          apikey: process.env.OPENTRIPMAP_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching location details: " + error.message);
  }
};

// Generate description using LLM API
const generateDescription = async (wikiText) => {
  try {
    const response = await axios.post(
      process.env.LLM_API_URL,
      {
        prompt: `Summarize this into a fun, two-sentence description: ${wikiText}`,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    throw new Error("Error generating description: " + error.message);
  }
};

module.exports = { fetchLocations, fetchLocationDetails, generateDescription };
