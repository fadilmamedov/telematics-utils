const fs = require("fs");
const yaml = require("js-yaml");
const commandLineArgs = require("command-line-args");
const axios = require("axios");

const generateVehicleStats = require("./generateVehicleStats");
const generateNavigationLogs = require("./generateNavigationLogs");

const { source: sourceFile, address: findAddress = false } = commandLineArgs([
  { name: "source", alias: "s", type: String },
  { name: "address", alias: "a", type: Boolean },
]);

const sourceFileContent = fs.readFileSync(sourceFile, "utf-8");
const scenario = yaml.load(sourceFileContent);

const run = async () => {
  console.log("Generating vehicle stats...");
  const vehicleStats = await generateVehicleStats(scenario, findAddress);
  console.log("Completed");

  console.log("Generating navigation logs...");
  const navigationLogs = generateNavigationLogs(vehicleStats);
  console.log("Completed");

  console.log(`Deleting current navigation logs for VIN - ${scenario.vin}...`);
  try {
    await axios.delete(
      `https://silver.stg4.gobolt.com/telematics/navigation-logs/clear/${scenario.vin}`,
      {
        headers: {
          Authorization: "Bearer ",
        },
      }
    );
    console.log("Completed");
  } catch (error) {
    console.error(error.message);
  }

  console.log("Uploading navigation logs to Silver Staging 4...");
  try {
    await axios.post(
      "https://silver.stg4.gobolt.com/telematics/navigation-logs",
      {
        navigation_logs: navigationLogs,
      },
      {
        headers: {
          Authorization: "Bearer ",
        },
      }
    );

    console.log(
      `Completed. ${navigationLogs.length} navigation logs uploaded with VIN - ${scenario.vin}`
    );
  } catch (error) {
    console.error(error.message);
  }
};

run();
