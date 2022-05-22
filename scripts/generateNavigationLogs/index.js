const fs = require("fs");
const commandLineArgs = require("command-line-args");

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

console.log(fetchIntervalInSeconds);
