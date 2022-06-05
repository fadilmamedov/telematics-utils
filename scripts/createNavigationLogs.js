const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const commandLineArgs = require("command-line-args");
const axios = require("axios");
const chalk = require("chalk");
const moment = require("moment-timezone");
const turf = require("@turf/turf");
const _ = require("lodash");
const inquirer = require("inquirer");
const { parseDuration } = require("./generateVehicleStats/parseDuration");

const log = console.log;

const generateVehicleStats = require("./generateVehicleStats");
const generateNavigationLogs = require("./generateNavigationLogs");

const axiosInstance = axios.create({
  baseURL: "https://silver.stg4.gobolt.com",
  headers: {
    Authorization: "Bearer {token}",
  },
});

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

const timezone = scenario.timezone || "UTC";
const vin = scenario.vin;

const formatDateLocal = (date) => {
  return moment.tz(date, timezone).format("YYYY-MM-DD HH:mm:ss");
};

const getTotalDistance = (navigationLogs) => {
  const locations = navigationLogs.map(({ gpsLng, gpsLat }) => [gpsLng, gpsLat]);

  const path = turf.lineString(locations);
  return turf.length(path, { units: "meters" });
};

const getNavigationLogsBetweenDates = (navigationLogs, startDate, endDate) => {
  return navigationLogs.filter(({ requestDate: requestDateString }) => {
    const requestDate = moment(requestDateString);
    return requestDate.isBetween(startDate, endDate, undefined, "[)");
  });
};

const printNavigationLogsDetails = (navigationLogs) => {
  const firstNavigationLog = navigationLogs[0];
  const lastNavigationLog = navigationLogs[navigationLogs.length - 1];

  const startDate = moment(firstNavigationLog.requestDate);
  const endDate = moment(lastNavigationLog.requestDate);
  const duration = moment.duration(endDate.diff(startDate));
  const distance = getTotalDistance(navigationLogs);

  log(`Start date: ${chalk.cyan(formatDateLocal(startDate))}`);
  log(`End date:   ${chalk.cyan(formatDateLocal(endDate))}`);
  log(`Duration:   ${chalk.cyan(moment.utc(duration.asMilliseconds()).format("HH:mm:ss"))}`);
  log(`Distance:   ${chalk.cyan(`${_.round(distance / 1000, 2)}km`)}`);
};

const deleteNavigationLogs = async (vin) => {
  try {
    await axiosInstance.delete(`/telematics/navigation-logs/clear/${vin}`);
    log(chalk.green("Completed"));
  } catch (error) {
    log(chalk.red(`Error. ${error.message}`));
  }
};

const uploadNavigationLogs = async (navigationLogs) => {
  try {
    await axiosInstance.post("telematics/navigation-logs", {
      navigation_logs: navigationLogs,
    });

    log(chalk.green(`Completed. ${navigationLogs.length} navigation logs uploaded`));
  } catch (error) {
    log(chalk.red(`Error. ${error.message}`));
  }
};

const uploadNavigationLogsInteractive = async (navigationLogs) => {
  const firstNavigationLog = navigationLogs[0];
  const lastNavigationLog = navigationLogs[navigationLogs.length - 1];

  let currentDate = moment(firstNavigationLog.requestDate);
  const endDate = moment(lastNavigationLog.requestDate);

  while (currentDate.toDate() < endDate.toDate()) {
    const duration = await promptInteractiveModeDuration();

    let chunkEndDate = moment(currentDate).add(duration);
    if (chunkEndDate.toDate() > endDate.toDate()) {
      chunkEndDate = moment(endDate).add(1, "ms");
    }

    const chunkNavigationLogs = getNavigationLogsBetweenDates(
      navigationLogs,
      currentDate,
      chunkEndDate
    );
    if (chunkNavigationLogs.length === 0) {
      log(chalk.red("No navigation logs found for give date range. Increase duration"));
      continue;
    }

    log(
      "Uploading navigation logs for date range from " +
        chalk.cyan(formatDateLocal(currentDate)) +
        " to " +
        chalk.cyan(formatDateLocal(chunkEndDate))
    );
    await uploadNavigationLogs(chunkNavigationLogs);

    currentDate = moment(chunkEndDate);
  }

  log("");
  log(chalk.green("Completed. All navigation logs uploaded"));
};

const promptUploadInteractiveMode = async () => {
  const { useInteractiveMode } = await inquirer.prompt([
    {
      type: "list",
      name: "useInteractiveMode",
      message: "Would you like to enter interactive mode?",
      choices: ["Yes", "No (upload all navigation logs at once)"],
    },
  ]);

  return useInteractiveMode === "Yes";
};

const promptInteractiveModeDuration = async () => {
  const { duration: durationString } = await inquirer.prompt([
    {
      name: "duration",
      message: "Duration",
    },
  ]);

  return parseDuration(durationString);
};

const run = async () => {
  log("Generating vehicle stats...");
  const vehicleStats = await generateVehicleStats(scenario, shouldFindGPSLocationAddresses);
  log(chalk.green(`Completed. ${vehicleStats.length} vehicle stats generated`));

  if (vehicleStatsOutputFile) {
    fs.writeFileSync(vehicleStatsOutputFile, JSON.stringify(vehicleStats, null, 2), "utf-8");
    log(chalk.cyan(`Vehicle stats saved into ${path.resolve(vehicleStatsOutputFile)}`));
  }

  log("");

  log("Generating navigation logs...");
  const navigationLogs = generateNavigationLogs(vehicleStats);
  log(chalk.green(`Completed. ${navigationLogs.length} navigation logs generated`));
  printNavigationLogsDetails(navigationLogs);

  log("");

  log(`Deleting navigation logs for VIN ${chalk.magenta(vin)} from Silver Staging 4...`);
  await deleteNavigationLogs(vin);

  log("");

  const currentDate = moment();
  const navigationLogsStartDate = moment(navigationLogs[0].requestDate);
  const navigationLogsEndDate = moment(navigationLogs[navigationLogs.length - 1].requestDate);

  log("Upload navigation logs");
  log(`Timezone:                   ${chalk.cyan(timezone)}`);
  log(`Navigation logs start date: ${chalk.cyan(formatDateLocal(navigationLogsStartDate))}`);
  log(`Navigation logs end date:   ${chalk.cyan(formatDateLocal(navigationLogsEndDate))}`);
  log(`Current local date:         ${chalk.cyan(formatDateLocal(currentDate))}`);

  log("");

  const isInteractiveModeEnabled = await promptUploadInteractiveMode();
  if (isInteractiveModeEnabled) {
    log("");
    log("Uploading navigation logs to Silver Staging 4 in interactive mode...");
    await uploadNavigationLogsInteractive(navigationLogs);
  } else {
    log(`Uploading all navigation logs to Silver Staging 4...`);
    await uploadNavigationLogs(navigationLogs);
  }
};

run();
