const moment = require("moment");
const { chunk } = require("lodash");

const parseDuration = (durationString) => {
  const duration = moment.duration();

  const durationParts = durationString.split(" ");
  chunk(durationParts, 2).forEach(([value, unit]) => {
    duration.add(value, unit);
  });

  return duration;
};

module.exports = { parseDuration };
