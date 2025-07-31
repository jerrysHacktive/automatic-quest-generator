const { fetchLocations } = require("../services/api-service");
const { createQuest } = require("../models/quest-model");
const {
  displayLocations,
  promptLocationSelection,
  displayQuest,
  displayError,
} = require("../views/quest-views");
const fs = require("fs");
const path = require("path");
const { stringify } = require("csv");

// const headers = [
//   "Title",
//   "Aura",
//   "Category",
//   "Description",
//   "Tier",
//   "Latitude",
//   "Longitude",
//   "Pricing",
//   "Prompt"
// ];

const startQuestCreation = async (locationName) => {
  try {
    const locations = await fetchLocations(locationName);
    if (locations.length === 0) {
      displayError("No locations found.");
      return false;
    }

    displayLocations(locations);
    const selectedLocation = await promptLocationSelection(locations);

    const quest = await createQuest(locationName, selectedLocation);
    displayQuest(quest);

    console.log("Saving to CSV...")
    const data = [[
      quest.Title,
      quest.Aura,
      quest.Category,
      quest.Description,
      quest.Tier,
      quest.Latitude,
      quest.Longitude,
      quest.Pricing,
      quest.Prompt
    ]];

    const csvFilePath = path.join(__dirname, "../saved/saved.csv");
    stringify(data, {}, (err, output) => {
      if (err) throw err;
      fs.appendFileSync(csvFilePath, output, "utf8");
    });

    return true;
  } catch (error) {
    displayError(error.message);
    return false;
  }
};

module.exports = { startQuestCreation };
