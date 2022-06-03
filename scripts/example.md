## Create navigation logs

Creates navigation logs based on testing scenario specified in YAML format and uploads them to Silver Staging 4. All current navigation logs for specified VIN number will be removed from the database

```
node createNavigationLogs -s scenario.yaml [-o vehicleStats.json] [-a]
```

### Options

- `-s` - source file with testing scenario in YAML format
- `-o` - output file with vehicle stats in JSON format (optional)
- `-a` - find GPS location addresses (optional, defaults to false)
