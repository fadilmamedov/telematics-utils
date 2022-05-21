const yaml = require("js-yaml");
const { getCommands } = require("./getCommands");
const { generateEngineStateStats } = require("./generateEngineVehicleStats");

describe("generateEngineStateStats", () => {
  test("repeated engine state in a row", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - engine: on
        - engine: off
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "off", date: new Date("2022-05-10T09:00:00Z") },
    ]);
  });

  test("repeated engine state not in a row", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - move:
            duration: 1 minute
        - engine: on
        - engine: off
        - stay:
            duration: 1 minute
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "off", date: new Date("2022-05-10T09:01:00Z") },
    ]);
  });

  test("stay with engine on < 2 minutes, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - move:
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "on", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("stay with engine on 2 minutes, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 2 minute
        - move:
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "on", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("stay with engine on > 2 minutes, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 3 minutes
        - move:
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z") },
      { value: "on", date: new Date("2022-05-10T09:03:00Z") },
    ]);
  });

  test("stay with engine on < 2 minutes, then turn engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "off", date: new Date("2022-05-10T09:01:00Z") },
    ]);
  });

  test("stay with engine on 2 minutes, then turn engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 2 minutes
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "off", date: new Date("2022-05-10T09:02:00Z") },
    ]);
  });

  test("stay with engine on > 2 minutes, then turn engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 3 minutes
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z") },
      { value: "off", date: new Date("2022-05-10T09:03:00Z") },
    ]);
  });

  test("move in a row", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - move:
            duration: 1 minute
        - move:
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "on", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("move, then turn engine on, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - move:
            duration: 1 minute
        - engine: on
        - move:
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "on", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("stay with engine on in a row < 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 30 seconds
        - stay:
            duration: 30 seconds
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "on", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("stay with engine on in a row > 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z") },
    ]);
  });

  test("stay with engine on, then turn engine on, then stay with engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - engine: on
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z") },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z") },
    ]);
  });

  test("stay with engine off < 2 minutes, then turn engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - engine: on
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z") },
      { value: "on", date: new Date("2022-05-10T09:01:00Z") },
    ]);
  });

  test("stay with engine off 2 minutes, then turn engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: off
        - stay:
            duration: 2 minutes
        - engine: on
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z") },
      { value: "on", date: new Date("2022-05-10T09:02:00Z") },
    ]);
  });

  test("stay with engine off > 2 minutes, then turn engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: off
        - stay:
            duration: 3 minutes
        - engine: on
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z") },
      { value: "on", date: new Date("2022-05-10T09:03:00Z") },
    ]);
  });

  test("stay with engine off in a row < 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: off
        - stay:
            duration: 30 seconds
        - stay:
            duration: 30 seconds
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "off", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("stay with engine off in a row > 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "off", date: new Date("2022-05-10T09:00:00Z") }]);
  });

  test("stay with engine off, then turn engine off, then stay with engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [-79.405518, 43.651348]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - engine: off
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateEngineStateStats(commands);

    expect(engineStateStats).toEqual([{ value: "off", date: new Date("2022-05-10T09:00:00Z") }]);
  });
});
