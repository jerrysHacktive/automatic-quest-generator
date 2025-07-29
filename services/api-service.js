const axios = require("axios");
require("dotenv").config();

// Fetch locations from LocationIQ by name
const fetchLocations = async (locationName) => {
  try {
    const response = await axios.get("https://api.locationiq.com/v1/search", {
      params: {
        q: locationName,
        format: "json",
        limit: 10,
        key: process.env.LOCATIONIQ_API_KEY,
      },
    });
    if (!response.data || response.data.length === 0) {
      throw new Error("No locations found for: " + locationName);
    }
    console.log(
      "Raw LocationIQ Search Response:",
      JSON.stringify(response.data, null, 2)
    );
    // Normalize response to prevent undefined
    return response.data.map((item, index) => ({
      id: index + 1, // Add index for CLI selection
      place_id: item.place_id || `loc_${index}`,
      name: item.display_name || "Unknown Location",
      type: item.type || "Unknown Type",
      lat: item.lat || null,
      lon: item.lon || null,
    }));
  } catch (error) {
    console.error("LocationIQ Fetch Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw new Error(`Error fetching locations: ${error.message}`);
  }
};

// Fetch nearby POIs for details
const fetchLocationDetails = async (lat, lon) => {
  try {
    const response = await axios.get("https://api.locationiq.com/v1/nearby", {
      params: {
        lat,
        lon,
        format: "json",
        key: process.env.LOCATIONIQ_API_KEY,
        limit: 1,
      },
    });
    if (!response.data || response.data.length === 0) {
      throw new Error("No details found for coordinates: " + lat + ", " + lon);
    }
    console.log(
      "Raw LocationIQ Nearby Response:",
      JSON.stringify(response.data, null, 2)
    );
    const data = response.data[0];
    return {
      name: data.name || data.display_name || "Unknown",
      type: data.type || "Unknown Type",
      lat: data.lat || lat,
      lon: data.lon || lon,
    };
  } catch (error) {
    console.error("LocationIQ Details Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    // Fallback to basic data if nearby fails
    return { name: "Unknown", type: "Unknown Type", lat, lon };
  }
};

// Generate description by fetching Wikipedia extract and using LLM API or fallback
const generateDescription = async (locationName) => {
  try {
    // Fetch Wikipedia extract for the location
    const wikiResponse = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        prop: "extracts",
        exintro: true,
        explaintext: true,
        titles: locationName.split(",")[0].trim(), // e.g., "Eiffel Tower" from "Eiffel Tower, Paris"
        format: "json",
      },
    });
    const pages = wikiResponse.data.query.pages;
    const wikiText =
      Object.values(pages)[0].extract || "No Wikipedia data available.";
    console.log("Wikipedia Extract:", wikiText);

    // Generate description using LLM API
    const llmResponse = await axios.post(
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
    return llmResponse.data.choices[0].text.trim();
  } catch (error) {
    console.error("Generate Description Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    // Fallback to basic description if Wikipedia or LLM fails
    const fallbackName = locationName.split(",")[0].trim() || "this location";
    return `Explore ${fallbackName}, a fascinating landmark! Discover its history and capture its beauty for an unforgettable quest.`;
  }
};

module.exports = { fetchLocations, fetchLocationDetails, generateDescription };
