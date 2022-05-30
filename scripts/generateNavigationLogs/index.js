const fs = require("fs");
const moment = require("moment");
const commandLineArgs = require("command-line-args");
const papaparse = require("papaparse");

const {
  source: sourceFile,
  fetchInterval: fetchIntervalInSeconds = 60,
  output: outputFile,
} = commandLineArgs([
  { name: "source", alias: "s", type: String },
  { name: "fetchInterval", alias: "i", type: Number },
  { name: "output", alias: "o", type: String },
]);

const sourceFileContent = fs.readFileSync(sourceFile, "utf-8");

const vehicleStats = JSON.parse(sourceFileContent);
const vehicleEngineStateStats = vehicleStats.filter((s) => s.type === "engine");
const vehicleGpsStats = vehicleStats.filter((s) => s.type === "gps");

const startDate = moment(vehicleStats[0].date);
const endDate = moment(vehicleStats[vehicleStats.length - 1].date).add(
  fetchIntervalInSeconds,
  "seconds"
);

let id = 1;
let currentDate = moment(startDate);

const navigationLogs = [];

while (currentDate.toDate() < endDate.toDate()) {
  const engine = findVehicleStatsBeforeDate(vehicleEngineStateStats, currentDate.toDate());
  const gps = findVehicleStatsBeforeDate(vehicleGpsStats, currentDate.toDate());

  if (!engine || !gps) continue;

  navigationLogs.push({
    id,
    deviceID: "DEVICE_ID",
    vin: engine.vin ?? gps.vin,
    engineStateDate: engine.date,
    engineState: engine.value,
    gpsDate: gps.date,
    gpsLng: gps.location[0],
    gpsLat: gps.location[1],
    gpsFormattedLocation: gps.formattedLocation || "Formatted location",
    requestDate: currentDate.utc().format(),
  });

  id++;
  currentDate.add(fetchIntervalInSeconds, "seconds");
}

if (outputFile.endsWith(".csv")) {
  const navigationLogsCSV = papaparse.unparse(navigationLogs);
  fs.writeFileSync(outputFile, navigationLogsCSV, "utf-8");
} else if (outputFile.endsWith(".json")) {
  fs.writeFileSync(outputFile, JSON.stringify(navigationLogs, null, 2), "utf-8");
} else {
  console.log(navigationLogs);
}

function findVehicleStatsBeforeDate(vehicleStats, date) {
  let i = 0;
  try {
    while (vehicleStats[i] && moment(vehicleStats[i].date).toDate() <= currentDate) i++;
    return vehicleStats[i - 1];
  } catch {
    console.log(i);
  }
}
