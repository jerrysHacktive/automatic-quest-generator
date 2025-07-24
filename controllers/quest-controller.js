const { fetchLocations } = require("../services/api-service");
const { createQuest } = require("../models/quest-model");
const {
  displayLocations,
  promptLocationSelection,
  displayQuest,
  displayError,
} = require("../views/quest-views");

const startQuestCreation = async (locationName) => {
  try {
    // Fetch locations
    const locationsData = await fetchLocations(locationName);
    const locations = Array.isArray(locationsData.features)
      ? locationsData.features
      : [locationsData];

    if (locations.length === 0) {
      displayError("No locations found.");
      return;
    }

    // Display and select location
    displayLocations(locations);
    const selectedLocation = promptLocationSelection(locations);

    // Create and display quest
    const quest = await createQuest(selectedLocation);
    displayQuest(quest);
  } catch (error) {
    displayError(error.message);
  }
};

module.exports = { startQuestCreation };
