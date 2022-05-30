## Generate vehicle stats

```
node generateVehicleStats -s scenario.yaml -o vehicleStats.json -a
```

### Options

- source (`--source` or `-s`) Source file with commands in YAML format
- output (`--output` or `-o`) Output file with vehicle stats in JSON format
- address (`--address` or `-a`) Find GPS location addresses

## Generate navigation logs

```
node generateNavigationLogs -s vehicleStats.json -o navigationLogs.json -i 60
```

### Options

- source (`--source` or `-s`) Source file with vehicle stats in JSON format
- outout (`--output` or `-o`) Output file with navigation logs in JSON or CSV format
- fetch interval (`--fetchInterval` or `-i`) Vehicle stats fetch interval in seconds (optional, defaults to 60 seconds)
