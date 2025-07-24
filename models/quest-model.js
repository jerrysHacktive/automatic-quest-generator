const {
  fetchLocationDetails,
  generateDescription,
} = require("../services/api-service");

const createQuest = async (location) => {
  try {
    // Fetch detailed location data
    const details = await fetchLocationDetails(location.xid);

    // Initialize quest object
    const quest = {
      Title: details.name || "Unknown Location",
      Aura: 400,
      Category: details.kinds ? details.kinds.split(",")[0] : "General",
      Description: "No description available.",
      Latitude: details.point.lat || 0,
      Longitude: details.point.lon || 0,
      Price: null,
    };

    // Generate description if Wikipedia extract exists
    if (details.wikipedia_extracts && details.wikipedia_extracts.text) {
      quest.Description = await generateDescription(
        details.wikipedia_extracts.text
      );
    }

    return quest;
  } catch (error) {
    throw new Error("Error creating quest: " + error.message);
  }
};

module.exports = { createQuest };
