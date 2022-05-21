const moment = require("moment");

const logCommands = (commands) => {
  const logCommands = commands.map((command) => {
    if (command.name === "engine") {
      return {
        name: command.name,
        value: command.value,
        date: moment(command.date).utc().format(),
      };
    }

    return {
      name: command.name,
      date: moment(command.date).utc().format(),
      duration: command.duration,
    };
  });
  console.log(logCommands);
};

module.exports = { logCommands };
