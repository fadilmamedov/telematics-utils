const fs = require("fs");
const yaml = require("js-yaml");
const commandLineArgs = require("command-line-args");

const { getCommands } = require("./getCommands");
const { logCommands } = require("./logCommands");
const { generateEngineStateStats } = require("./generateEngineVehicleStats");
const { generateGpsStats } = require("./generateGpsStats");

const { source: sourceFile } = commandLineArgs([{ name: "source", alias: "s", type: String }]);

const sourceFileContent = fs.readFileSync(sourceFile, "utf-8");
const scenario = yaml.load(sourceFileContent);

const commands = getCommands(scenario);
const engineStateStats = generateEngineStateStats(commands);
const gpsStats = generateGpsStats(commands, scenario.location);
console.log(gpsStats);
// console.log(engineStateStats);
// console.log(JSON.stringify(engineStateStats, null, 2));
