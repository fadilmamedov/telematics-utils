interface SamsaraVehicleStats {
  id: string;
  engineState: {
    time: string;
    value: "On" | "Off" | "Idle";
  };
  gps: {
    time: string;
    latitude: number;
    longitude: number;
    reverseGeo: {
      formattedLocation: string;
    };
  };
}

export interface SamsaraVehiclesStatsResponse {
  data: SamsaraVehicleStats[];
  pagination: {
    endCursor: string;
    hasNextPage: boolean;
  };
}

export const fetchVehiclesStats = async (token: string, date: string, deviceID: string) => {
  const response = await fetch(
    `/fleet/vehicles/stats?types=gps,engineStates&time=${date}&vehicleIds=${deviceID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { data: vehiclesStats }: SamsaraVehiclesStatsResponse = await response.json();

  if (!vehiclesStats[0]) {
    throw new Error("Wrong device ID");
  }

  return vehiclesStats[0];
};
