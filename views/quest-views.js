const readlineSync = require("readline-sync");

const displayLocations = (locations) => {
  console.log("\nFound Locations:");
  locations.forEach((loc, index) => {
    console.log(`${index + 1}. ${loc.name} (${loc.country})`);
  });
};

const promptLocationSelection = (locations) => {
  const choice = readlineSync.questionInt(
    "\nSelect a location (enter number): ",
    {
      min: 1,
      max: locations.length,
    }
  );
  return locations[choice - 1];
};

const displayQuest = (quest) => {
  console.log("\nGenerated Quest:");
  console.log(`Title: ${quest.Title}`);
  console.log(`Aura: ${quest.Aura}`);
  console.log(`Category: ${quest.Category}`);
  console.log(`Description: ${quest.Description}`);
  console.log(`Latitude: ${quest.Latitude}`);
  console.log(`Longitude: ${quest.Longitude}`);
  console.log(`Price: ${quest.Price}`);
};

const displayError = (message) => {
  console.log(`Error: ${message}`);
};

module.exports = {
  displayLocations,
  promptLocationSelection,
  displayQuest,
  displayError,
};
