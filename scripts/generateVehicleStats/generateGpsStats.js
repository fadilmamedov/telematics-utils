const axios = require("axios");
const moment = require("moment");
const { sortBy } = require("lodash");
const cliProgress = require("cli-progress");
const { getAlongLocation } = require("./getAlongLocation");
const { generateEngineStateStats } = require("./generateEngineVehicleStats");

const getEndDate = (commands) => {
  const lastCommand = commands[commands.length - 1];

  if (lastCommand.duration) {
    return moment(lastCommand.date).add(lastCommand.duration, "seconds").toDate();
  }

  return lastCommand.date;
};

const getSendDataTimePoints = (commands) => {
  const result = [];

  const endDate = getEndDate(commands);
  const engineStateStats = generateEngineStateStats(commands);
  engineStateStats.forEach(({ value, date }, index) => {
    const engineStateStartDate = date;
    const engineStateEndDate = engineStateStats[index + 1]?.date ?? endDate;

    let currentDate = moment(engineStateStartDate);
    while (currentDate.toDate() < engineStateEndDate) {
      result.push(currentDate.toDate());

      if (value === "off") {
        currentDate.add(5, "minutes");
      }
      if (value === "on" || value === "idle") {
        currentDate.add(5, "seconds");
      }
    }
  });

  return result;
};

const getSendDataTimePointsBetweenDates = (sendDataTimePoints, startDate, endDate) => {
  return sendDataTimePoints.filter((date) => {
    return date >= startDate && date < endDate;
  });
};

const locationCache = {};
const getFormattedLocation = async (location) => {
  const [lng, lat] = location;

  if (locationCache[JSON.stringify(location)]) {
    return locationCache[JSON.stringify(location)];
  }

  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=0`
  );

  const formattedLocation = response.data.display_name;
  locationCache[JSON.stringify(location)] = formattedLocation;

  return formattedLocation;
};

const generateGpsStats = async (commands, startLocation, findAddress) => {
  let gpsStats = [];

  let currentLocation = startLocation;
  const sendDataTimePoints = getSendDataTimePoints(commands);

  commands.forEach(({ name, date, duration, to }) => {
    if (name !== "stay" && name !== "move") return;

    const startDate = date;
    const endDate = moment(date).add(duration, "seconds").toDate();
    const commandSendDataTimePoints = getSendDataTimePointsBetweenDates(
      sendDataTimePoints,
      startDate,
      endDate
    );

    if (name === "stay") {
      commandSendDataTimePoints.forEach((date) => {
        gpsStats.push({ date, location: currentLocation, formattedLocation: "" });
      });
    }

    if (name === "move") {
      commandSendDataTimePoints.forEach((date) => {
        const location = getAlongLocation(currentLocation, to, startDate, endDate, date);
        gpsStats.push({ date, location, formattedLocation: "" });
      });
      currentLocation = to;
    }
  });

  gpsStats = sortBy(gpsStats, ({ date }) => date);

  if (findAddress) {
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(gpsStats.length, 0);

    let index = 0;
    for await (let gpsStatsEntry of gpsStats) {
      index += 1;
      gpsStatsEntry.formattedLocation = await getFormattedLocation(gpsStatsEntry.location);
      progressBar.update(index);
    }

    progressBar.stop();
  }

  return gpsStats;
};

module.exports = { generateGpsStats };
