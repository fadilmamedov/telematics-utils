const yaml = require("js-yaml");
const { getCommands } = require("./getCommands");
const { generateVehicleEngineStateStats } = require("./generateVehicleEngineStateStats");

describe("generateVehicleEngineStateStats", () => {
  test("repeated engine state in a row", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - engine: on
        - engine: off
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("repeated engine state not in a row", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - move:
            to: [20, 20]
            duration: 1 minute
        - engine: on
        - engine: off
        - stay:
            duration: 1 minute
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "off", date: new Date("2022-05-10T09:01:00Z"), location: [20, 20] },
    ]);
  });

  test("stay with engine on < 2 minutes, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - move:
            to: [20, 20]
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on 2 minutes, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 2 minute
        - move:
            to: [20, 20]
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on > 2 minutes, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 3 minutes
        - move:
            to: [20, 20]
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z"), location: [10, 10] },
      { value: "on", date: new Date("2022-05-10T09:03:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on < 2 minutes, then turn engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "off", date: new Date("2022-05-10T09:01:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on 2 minutes, then turn engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 2 minutes
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "off", date: new Date("2022-05-10T09:02:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on > 2 minutes, then turn engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 3 minutes
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z"), location: [10, 10] },
      { value: "off", date: new Date("2022-05-10T09:03:00Z"), location: [10, 10] },
    ]);
  });

  test("move in a row", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - move:
            to: [20, 20]
            duration: 1 minute
        - move:
            to: [30, 30]
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("move, then turn engine on, then move", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - move:
            to: [20, 20]
            duration: 1 minute
        - engine: on
        - move:
            to: [30, 30]
            duration: 1 minute
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on in a row < 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 30 seconds
        - stay:
            duration: 30 seconds
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on in a row > 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine on, then turn engine on, then stay with engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: on
        - stay:
            duration: 1 minute
        - engine: on
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "on", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "idle", date: new Date("2022-05-10T09:02:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine off < 2 minutes, then turn engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - engine: on
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "on", date: new Date("2022-05-10T09:01:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine off 2 minutes, then turn engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 2 minutes
        - engine: on
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "on", date: new Date("2022-05-10T09:02:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine off > 2 minutes, then turn engine on", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 3 minutes
        - engine: on
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
      { value: "on", date: new Date("2022-05-10T09:03:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine off in a row < 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 30 seconds
        - stay:
            duration: 30 seconds
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine off in a row > 2 minutes in total", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("stay with engine off, then turn engine off, then stay with engine off", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - engine: off
        - stay:
            duration: 2 minutes
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: new Date("2022-05-10T09:00:00Z"), location: [10, 10] },
    ]);
  });

  test("finds engine state locations", () => {
    const scenario = yaml.load(`
      date: 2022-05-10T09:00:00Z
      location: [10, 10]
      steps:
        - engine: off
        - stay:
            duration: 1 minute
        - engine: on
        - move:
            to: [20, 20]
            duration: 2 minutes
        - stay:
            duration: 10 minutes
        - move:
            to: [30, 30]
            duration: 1 minute
        - engine: off
    `);

    const commands = getCommands(scenario);
    const engineStateStats = generateVehicleEngineStateStats(commands, scenario.location);

    expect(engineStateStats).toEqual([
      { value: "off", date: expect.anything(), location: [10, 10] },
      { value: "on", date: expect.anything(), location: [10, 10] },
      { value: "idle", date: expect.anything(), location: [20, 20] },
      { value: "on", date: expect.anything(), location: [20, 20] },
      { value: "off", date: expect.anything(), location: [30, 30] },
    ]);
  });
});
