import { URL, API_KEY } from "./config";

const LOCATION_MAP: Record<string, string> = {
  'CPCC': 'CPCC',
  'TeCSAR Lab': 'TeCSAR Lab',
  'Parking lot': 'Parking lot',
  '7th Street Market': '7_Street_Market',
  'ABC Store': 'ABC Store',
};

const getHourlyData = async (location: string, camId: string) => {
  const dbLocation = LOCATION_MAP[location] ?? location;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        query: `
          query listSafeCHourlyData {
            listSafeCHourlyData(
              filter: {
                Location: { eq: "${dbLocation}" }
                Cam_ID: { eq: "${camId}" }
              }
              limit: 100
            ) {
              items {
                id
                Recorded_Time
                Cam_ID
                Location
                People_Count
                Average_People
                Cumulative_People
                Cumulative_Anomalies
                Maximum_people
                total_people
                Hour
                Day
                Updated_Time
              }
              nextToken
            }
          }
        `,
      }),
    });

    const data = await response.json();
    console.log(`[${dbLocation}][${camId}] raw:`, data);

    const items: any[] = data?.data?.listSafeCHourlyData?.items || [];
    
    if (items.length === 0) {
      console.warn(`[${dbLocation}][${camId}] no items found`);
      return null;
    }

    const sorted = [...items].sort((a, b) =>
      new Date(b.Updated_Time).getTime() - new Date(a.Updated_Time).getTime()
    );

    console.log(`[${dbLocation}][${camId}] latest:`, sorted[0]);
    return sorted[0];

  } catch (error) {
    console.error(`getHourlyData error [${dbLocation}][${camId}]:`, error);
    return null;
  }
};

export default getHourlyData;