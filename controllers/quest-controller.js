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
    const locations = await fetchLocations(locationName);
    if (locations.length === 0) {
      displayError("No locations found.");
      return false;
    }

    displayLocations(locations);
    const selectedLocation = await promptLocationSelection(locations);

    const quest = await createQuest(selectedLocation);
    displayQuest(quest);
    return true;
  } catch (error) {
    displayError(error.message);
    return false;
  }
};

module.exports = { startQuestCreation };
