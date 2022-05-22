import cls from "classnames";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Button, Classes, Navbar } from "@blueprintjs/core";
import { SettingsPopover } from "components/settings";
import { NavigationLogsPage } from "pages/NavigationLogs";
import { VehicleStatsPage } from "pages/VehicleStats";

export const Application = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-slate-100">
        <Navbar>
          <Navbar.Group>
            <Navbar.Heading>Telematics Utilities</Navbar.Heading>
            <Navbar.Divider />

            <Link to="/navigation-logs" className={cls(Classes.BUTTON, Classes.MINIMAL)}>
              Navigation Logs
            </Link>

            <Link to="/vehicle-stats" className={cls(Classes.BUTTON, Classes.MINIMAL)}>
              Vehicle Stats
            </Link>
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
          <Routes>
            <Route path="/navigation-logs" element={<NavigationLogsPage />} />
            <Route path="/vehicle-stats" element={<VehicleStatsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
