const readlineSync = require("readline-sync");
const { startQuestCreation } = require("./controllers/quest-controller");

const main = async () => {
  console.log("Welcome to Quest Creator!");
  const locationName = readlineSync.question(
    "Enter a location name (e.g., Eiffel Tower, Paris): "
  );
  const success = await startQuestCreation(locationName);
  if (success) {
    console.log("Quest creation complete......");
  } else {
    console.error("quest creation not completed.....");
  }
};

main();
