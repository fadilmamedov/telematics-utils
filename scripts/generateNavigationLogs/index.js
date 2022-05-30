const fs = require("fs");
const moment = require("moment");
const commandLineArgs = require("command-line-args");
const papaparse = require("papaparse");

const {
  source: sourceFile,
  fetchInterval: fetchIntervalInSeconds,
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
    device_id: "DEVICE_ID",
    vehicle_id: "f1ed2cf8-9cea-4347-9946-eb2f893d0509",
    engine_state_date: engine.date,
    engine_state: engine.value,
    gps_date: gps.date,
    gps_lng: gps.location[0],
    gps_lat: gps.location[1],
    gps_formatted_location: gps.formattedLocation,
    request_date: currentDate.utc().format(),
  });

  id++;
  currentDate.add(fetchIntervalInSeconds, "seconds");
}

const navigationLogsCSV = papaparse.unparse(navigationLogs);
fs.writeFileSync(outputFile, navigationLogsCSV, "utf-8");

function findVehicleStatsBeforeDate(vehicleStats, date) {
  let i = 0;
  try {
    while (vehicleStats[i] && moment(vehicleStats[i].date).toDate() <= currentDate) i++;
    return vehicleStats[i - 1];
  } catch {
    console.log(i);
  }
}
