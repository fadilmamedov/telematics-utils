const fs = require("fs");
const yaml = require("js-yaml");
const commandLineArgs = require("command-line-args");
const axios = require("axios");

const generateVehicleStats = require("./generateVehicleStats");
const generateNavigationLogs = require("./generateNavigationLogs");

const {
  source: scenarioSourceFile,
  output: vehicleStatsOutputFile,
  address: shouldFindGPSLocationAddresses = false,
} = commandLineArgs([
  { name: "source", alias: "s", type: String },
  { name: "output", alias: "o", type: String },
  { name: "address", alias: "a", type: Boolean },
]);

const scenarioSourceFileContent = fs.readFileSync(scenarioSourceFile, "utf-8");
const scenario = yaml.load(scenarioSourceFileContent);

const run = async () => {
  console.log("Generating vehicle stats...");
  const vehicleStats = await generateVehicleStats(scenario, shouldFindGPSLocationAddresses);
  console.log("Completed");

  if (vehicleStatsOutputFile) {
    fs.writeFileSync(vehicleStatsOutputFile, JSON.stringify(vehicleStats, null, 2), "utf-8");
    console.log(`Vehicle stats saved into ${vehicleStatsOutputFile}`);
  }

  console.log("Generating navigation logs...");
  const navigationLogs = generateNavigationLogs(vehicleStats);
  console.log("Completed");

  console.log(`Deleting current navigation logs for VIN - ${scenario.vin}...`);
  try {
    await axios.delete(
      `https://silver.stg4.gobolt.com/telematics/navigation-logs/clear/${scenario.vin}`,
      {
        headers: {
          Authorization: "Bearer {token}",
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
          Authorization: "Bearer {token}",
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
