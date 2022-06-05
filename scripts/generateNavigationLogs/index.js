const moment = require("moment");

module.exports = (vehicleStats, fetchIntervalInSeconds = 60) => {
  const vehicleEngineStateStats = vehicleStats.filter(({ type }) => type === "engine");
  const vehicleGpsStats = vehicleStats.filter(({ type }) => type === "gps");

  const startDate = moment(vehicleStats[0].date);
  const endDate = moment(vehicleStats[vehicleStats.length - 1].date).add(
    fetchIntervalInSeconds,
    "seconds"
  );

  let id = 1;
  let engineStateIndex = 0;
  let gpsIndex = 0;
  let currentDate = moment(startDate);

  const navigationLogs = [];

  while (currentDate.toDate() < endDate.toDate()) {
    engineStateIndex = findVehicleStatsBeforeDate(
      vehicleEngineStateStats,
      currentDate.toDate(),
      engineStateIndex
    );
    gpsIndex = findVehicleStatsBeforeDate(vehicleGpsStats, currentDate.toDate(), gpsIndex);

    const engineState = vehicleEngineStateStats[engineStateIndex];
    const gps = vehicleGpsStats[gpsIndex];

    if (!engineState || !gps) continue;

    navigationLogs.push({
      id,
      deviceID: "DEVICE_ID",
      vin: engineState.vin ?? gps.vin,
      engineStateDate: engineState.date,
      engineState: engineState.value,
      gpsDate: gps.date,
      gpsLng: gps.location[0],
      gpsLat: gps.location[1],
      gpsFormattedLocation: gps.formattedLocation || "Formatted location",
      requestDate: currentDate.utc().format(),
    });

    id++;
    currentDate.add(fetchIntervalInSeconds, "seconds");
  }

  return navigationLogs;

  function findVehicleStatsBeforeDate(vehicleStats, date, startIndex = 0) {
    let i = startIndex;
    while (vehicleStats[i] && moment(vehicleStats[i].date).toDate() <= currentDate) i++;
    return i - 1;
  }
};
