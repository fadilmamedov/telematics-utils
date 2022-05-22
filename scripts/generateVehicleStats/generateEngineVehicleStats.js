const moment = require("moment");
const { sortBy } = require("lodash");

const getEngineStateOnDate = (engineStates, date) => {
  const engineStatesSortedByDate = sortBy(engineStates, ({ date }) => date);

  for (let i = 0; i < engineStatesSortedByDate.length; i += 1) {
    if (engineStatesSortedByDate[i].date > date) {
      return engineStatesSortedByDate[i - 1]?.value ?? "off";
    }
  }

  return engineStatesSortedByDate[engineStatesSortedByDate.length - 1].value;
};

const findCommandLocation = (commands, command) => {
  let index = commands.indexOf(command) - 1;

  while (index >= 0) {
    const currentCommand = commands[index];
    if (currentCommand.to) {
      return currentCommand.to;
    }
    index -= 1;
  }
};

const generateEngineStateStats = (commands, startLocation) => {
  let result = [];

  const engineStateCommands = commands.filter((command) => command.name === "engine");
  engineStateCommands.forEach((command) => {
    result.push({
      value: command.value,
      date: command.date,
      location: findCommandLocation(commands, command) ?? startLocation,
    });
  });

  commands.forEach((command, index) => {
    if (command.name === "stay") {
      if (getEngineStateOnDate(result, command.date) === "off") {
        return;
      }

      if (command.duration > moment.duration(2, "minutes").asSeconds()) {
        result.push({
          value: "idle",
          date: moment(command.date).add(2, "minutes").toDate(),
          location: findCommandLocation(commands, command) ?? startLocation,
        });

        const nextCommand = commands[index + 1];
        if (nextCommand && nextCommand.name === "move") {
          result.push({
            value: "on",
            date: nextCommand.date,
            location: findCommandLocation(commands, nextCommand) ?? startLocation,
          });
        }
      }
    }
  });

  return sortBy(result, ({ date }) => date);
};

module.exports = { generateEngineStateStats };
