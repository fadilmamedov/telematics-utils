const moment = require("moment");
const { last } = require("lodash");
const { parseDuration } = require("./parseDuration");

const getCommands = (scenario) => {
  const commands = [];

  const startDate = moment.utc(scenario.date);
  const currentDate = moment(startDate);
  let currentEngineState = null;

  scenario.steps.forEach((step) => {
    const prevCommand = last(commands);

    if (step.engine) {
      if (step.engine === currentEngineState) return;

      commands.push({
        name: "engine",
        value: step.engine,
        date: moment(currentDate).toDate(),
      });
      currentEngineState = step.engine;

      return;
    }

    if (step.stay) {
      const duration = parseDuration(step.stay.duration);

      if (prevCommand?.name === "stay") {
        prevCommand.duration += duration.asSeconds();
        return;
      }

      commands.push({
        name: "stay",
        date: moment(currentDate).toDate(),
        // TODO: rename to durationSec
        duration: duration.asSeconds(),
      });
      currentDate.add(duration);

      return;
    }

    if (step.move) {
      const duration = parseDuration(step.move.duration);

      if (prevCommand?.name === "move") {
        prevCommand.duration += duration.asSeconds();
        return;
      }

      commands.push({
        name: "move",
        date: moment(currentDate).toDate(),
        duration: duration.asSeconds(),
        to: step.move.to,
      });
      currentDate.add(duration);

      return;
    }
  });

  return commands;
};

module.exports = { getCommands };
