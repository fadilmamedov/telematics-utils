## Generate vehicle stats

```
node generateVehicleStats -s scenario.yaml -o vehicleStats.json
```

### Options

- source (`--source` or `-s`) Source file with commands in YAML format
- output (`--output` or `-o`) Output file with vehicle stats in JSON format

## Generate navigation logs

```
node generateNavigationLogs -s vehicleStats.json -i 60 -o navigationLogs.json
```

### Options

- source (`--source` or `-s`) Source file with vehicle stats in JSON format
- fetch interval (`--fetchInterval` or `-i`) Vehicle stats fetch interval
- outout (`--output` or `-o`) Output file with navigation logs in JSON or CSV format
