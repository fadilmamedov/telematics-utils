const moment = require("moment");
const { sortBy } = require("lodash");
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

const generateGpsStats = (commands, startLocation) => {
  const result = [];
  console.log(commands);

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
        result.push({ date, location: currentLocation, formattedLocation: "" });
      });
    }

    if (name === "move") {
      commandSendDataTimePoints.forEach((date) => {
        const location = getAlongLocation(currentLocation, to, startDate, endDate, date);
        result.push({ date, location, formattedLocation: "" });
      });
      currentLocation = to;
    }
  });

  return sortBy(result, ({ date }) => date);
};

module.exports = { generateGpsStats };
