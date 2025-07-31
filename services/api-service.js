const axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import the library

// Initialize Gemini Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

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

// Generate description by fetching Wikipedia extract and using Gemini Flash API or fallback
const generateDescription = async (locationName) => {
  try {
    // Fetch Wikipedia extract for the location
    // const wikiResponse = await axios.get("https://en.wikipedia.org/w/api.php", {
    //   params: {
    //     action: "query",
    //     prop: "extracts",
    //     exintro: true,
    //     explaintext: true,
    //     titles: locationName.split(",")[0].trim(), // e.g., "Eiffel Tower" from "Eiffel Tower, Paris"
    //     format: "json",
    //   },
    // });
    // const pages = wikiResponse.data.query.pages;
    // const wikiText =
    //   Object.values(pages)[0].extract || "No Wikipedia data available.";
    // console.log("Wikipedia Extract:", wikiText);

    // Generate description using Gemini Flash API
    //For DESCRIPTION, summarize this text into a fun, two-sentence description: "${wikiText}"
    const prompt = `
You will be generating information for the following place: ${locationName}
Please fill in the following fields:

_DESCRIPTION_:
_CATEGORY_:
_TIER_:
_PRICING_:

For DESCRIPTION, create a fun, two-sentence description, based on the location and all information you know about it.
For CATEGORY, choose one of the following strings based on the place: "all", "nature", "food", "nightlife", "art", "historic", "retail".
For TIER, choose from "tier1", "tier2", "tier3", or "tier4" (most to least important) based on the place.
For PRICING, choose either "Free" or "$" - "$$$$", based on how expensive it is to gain admission (for a single person) to the place. ("$" is up to $10, and "$$$$" is up to around $60.)

Please only fill in those fields, and do not include anything else in your output.
    `;

    console.log("Generating data...")
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();
    console.log("Recieved generated text.")
    console.log(generatedText)

    let parts = generatedText.split(/_DESCRIPTION_:|_CATEGORY_:|_TIER_:|_PRICING_:/)
    let data = {
      Description: parts[1].trim(),
      Category: parts[2].trim(),
      Tier: parts[3].trim(),
      Pricing: parts[4].trim()
    };

    return data;

  } catch (error) {
    console.error("Generate Description Error:", {
      message: error.message,
    });
    // Fallback to basic description if Wikipedia or LLM fails
    const fallbackName = locationName.split(",")[0].trim() || "this location";
    let data = {
      Description: `Explore ${fallbackName}, a fascinating landmark! Discover its history and capture its beauty for an unforgettable quest.`,
      Category: "all",
      Tier: "tier2",
      Pricing: null
    };

    return data;
  }
};

module.exports = { fetchLocations, fetchLocationDetails, generateDescription };
