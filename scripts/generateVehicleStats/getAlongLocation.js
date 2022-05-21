const moment = require("moment");
const turf = require("@turf/turf");

const getAlongLocation = (from, to, startDate, endDate, date) => {
  const totalDistance = turf.distance(from, to, { units: "meters" });

  const totalDuration = moment.duration(moment(endDate).diff(startDate)).asSeconds();
  const duration = moment.duration(moment(date).diff(startDate)).asSeconds();

  const distance = (totalDistance * duration) / totalDuration;

  return turf.along(turf.lineString([from, to]), distance, { units: "meters" }).geometry
    .coordinates;
};

module.exports = { getAlongLocation };
