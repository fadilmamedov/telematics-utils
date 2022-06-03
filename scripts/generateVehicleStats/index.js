const { sortBy } = require("lodash");

const { getCommands } = require("./getCommands");
const { generateVehicleEngineStateStats } = require("./generateVehicleEngineStateStats");
const { generateVehicleGpsStats } = require("./generateVehicleGpsStats");

module.exports = async (scenario, findAddress = false) => {
  const commands = getCommands(scenario);

  let engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);
  engineStateStats = engineStateStats.map((s) => ({ type: "engine", ...s }));

  let gpsStats = await generateVehicleGpsStats(commands, scenario.location, findAddress);
  gpsStats = gpsStats.map((s) => ({ type: "gps", ...s }));

  const vehicleStats = sortBy([...engineStateStats, ...gpsStats], ({ date }) => date).map(
    (vehicleStats) => ({
      ...vehicleStats,
      vin: scenario.vin ?? "VIN",
    })
  );

  return vehicleStats;
};
