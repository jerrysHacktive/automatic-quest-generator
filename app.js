const readlineSync = require("readline-sync");
const { startQuestCreation } = require("./controllers/quest-controller");

const main = async () => {
  console.log("Welcome to Quest Creator!");
  const locationName = readlineSync.question("Enter a location name: ");
  await startQuestCreation(locationName);
  console.log("Quest creation complete.");
};

main();
