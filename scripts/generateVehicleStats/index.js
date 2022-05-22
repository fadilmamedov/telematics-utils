const { sortBy } = require("lodash");
const fs = require("fs");
const yaml = require("js-yaml");
const commandLineArgs = require("command-line-args");

const { getCommands } = require("./getCommands");
const { generateEngineStateStats } = require("./generateEngineVehicleStats");
const { generateGpsStats } = require("./generateGpsStats");

const { source: sourceFile, output: outputFile } = commandLineArgs([
  { name: "source", alias: "s", type: String },
  { name: "output", alias: "o", type: String },
]);

const sourceFileContent = fs.readFileSync(sourceFile, "utf-8");
const scenario = yaml.load(sourceFileContent);

const run = async () => {
  const commands = getCommands(scenario);

  let engineStateStats = generateEngineStateStats(commands);
  engineStateStats = engineStateStats.map((s) => ({ type: "engine", ...s }));

  let gpsStats = await generateGpsStats(commands, scenario.location);
  gpsStats = gpsStats.map((s) => ({ type: "gps", ...s }));

  const vehicleStats = sortBy([...engineStateStats, ...gpsStats], ({ date }) => date);

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(vehicleStats, null, 2), "utf-8");
  } else {
    console.log(vehicleStats);
  }
};

run();
