## Create navigation logs

Removes current navigation logs for VIN number specified in YAML scenario from Silver Staging 4, then creates navigation logs based on YAML scenario and uploads them to Silver Staging 4

```
node createNavigationLogs -s scenario.yaml
```

### Options

- source (`--source` or `-s`) Source file with commands in YAML format
- address (`--address` or `-a`) Find GPS location addresses (optional, defaults to false)
