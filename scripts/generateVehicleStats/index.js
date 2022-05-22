const { sortBy } = require("lodash");
const fs = require("fs");
const yaml = require("js-yaml");
const commandLineArgs = require("command-line-args");

const { getCommands } = require("./getCommands");
const { generateVehicleEngineStateStats } = require("./generateVehicleEngineStateStats");
const { generateVehicleGpsStats } = require("./generateVehicleGpsStats");

const {
  source: sourceFile,
  output: outputFile,
  address: findAddress,
} = commandLineArgs([
  { name: "source", alias: "s", type: String },
  { name: "output", alias: "o", type: String },
  { name: "address", alias: "a", type: Boolean },
]);

const sourceFileContent = fs.readFileSync(sourceFile, "utf-8");
const scenario = yaml.load(sourceFileContent);

const run = async () => {
  const commands = getCommands(scenario);

  let engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);
  engineStateStats = engineStateStats.map((s) => ({ type: "engine", ...s }));

  let gpsStats = await generateVehicleGpsStats(commands, scenario.location, findAddress);
  gpsStats = gpsStats.map((s) => ({ type: "gps", ...s }));

  const vehicleStats = sortBy([...engineStateStats, ...gpsStats], ({ date }) => date);

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(vehicleStats, null, 2), "utf-8");
  } else {
    console.log(vehicleStats);
  }
};

run();
