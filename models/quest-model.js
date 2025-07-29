const {
  fetchLocationDetails,
  generateDescription,
} = require("../services/api-service");

const createQuest = async (location) => {
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

    // Initialize quest object
    const quest = {
      Title: details.name || location.name || "Unknown Location",
      Aura: 400,
      Category: details.type || location.type || "General",
      Description: await generateDescription(location.name),
      Latitude: details.lat || location.lat || 0,
      Longitude: details.lon || location.lon || 0,
      Price: null,
    };

    return quest;
  } catch (error) {
    throw new Error("Error creating quest: " + error.message);
  }
};

module.exports = { createQuest };
