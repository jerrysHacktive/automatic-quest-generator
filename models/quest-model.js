const {
  fetchLocationDetails,
  generateDescription,
} = require("../services/api-service");

const createQuest = async (locationName, location) => {
  try {
    // Fetch detailed location data if coordinates are valid
    let details = {
      name: location.name,
      type: location.type,
      lat: location.lat,
      lon: location.lon,
    };
    if (
      location.lat &&
      location.lon &&
      !isNaN(location.lat) &&
      !isNaN(location.lon)
    ) {
      details = await fetchLocationDetails(location.lat, location.lon);
    } else {
      console.warn(
        "Skipping fetchLocationDetails due to invalid coordinates:",
        {
          lat: location.lat,
          lon: location.lon,
        }
      );
    }

    let info = await generateDescription(location.name);

    // Initialize quest object
    const quest = {
      Title: details.name || location.name || "Unknown Location",
      Aura: 400,
      Category: info.Category,
      Description: info.Description,
      Tier: info.Tier,
      Latitude: details.lat || location.lat || 0,
      Longitude: details.lon || location.lon || 0,
      Pricing: info.Pricing,
      Prompt: locationName
    };

    return quest;
  } catch (error) {
    throw new Error("Error creating quest: " + error.message);
  }
};

module.exports = { createQuest };
