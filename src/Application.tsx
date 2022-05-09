import { Button, Navbar } from "@blueprintjs/core";
import { SettingsPopover } from "components/settings";
import { NavigationLogsPage } from "pages/NavigationLogs/NavigationLogsPage";

export const Application = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>Telematics Utilities</Navbar.Heading>
          <Navbar.Divider />
          <Button icon="th" minimal>
            Navigation Logs
          </Button>
        </Navbar.Group>

        <Navbar.Group align="right">
          <SettingsPopover>
            <Button icon="cog" minimal>
              Settings
            </Button>
          </SettingsPopover>
        </Navbar.Group>
      </Navbar>

      <div className="flex-1 p-3">
        <NavigationLogsPage />
      </div>
    </div>
  );
};
