import { URL, API_KEY } from "./config";

const LOCATION_MAP: Record<string, string> = {
  'CPCC': 'CPCC',
  'TeCSAR Lab': 'TeCSAR Lab',
  'Parking lot': 'Parking lot',
  '7th Street Market': '7_Street_Market',
  'ABC Store': 'ABC Store',
  //new locations
  'VAPA-Center': 'VAPA-Center',
  'Bianco-Tower': 'Bianco-Tower',
  'CPCC_Merancas': 'CPCC_Merancas',
  'CPCC_Centrale': 'CPCC_Centrale',
};

const tokenCache: Record<string, string | null> = {};

const getHourlyData = async (location: string, camId: string) => {
  const dbLocation = LOCATION_MAP[location] ?? location;
  const cacheKey = `${dbLocation}#${camId}`;

  try {
    if (dbLocation === 'ABC Store') {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({
          query: `
            query list {
              listSafeCHourlyData(
                filter: {
                  Location: { eq: "ABC Store" }
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
      const items = data?.data?.listSafeCHourlyData?.items || [];
      if (items.length === 0) return null;
      return [...items].sort((a, b) =>
        new Date(b.Updated_Time).getTime() - new Date(a.Updated_Time).getTime()
      )[0];
    }

    let nextToken: string | null = tokenCache[cacheKey] ?? null;
    let allItems: any[] = [];
    let pages = 0;
    const MAX_PAGES = 30;
    let foundStart = false;

    while (pages < MAX_PAGES) {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({
          query: `
            query list {
              listSafeCHourlyData(
                filter: {
                  Location: { eq: "${dbLocation}" }
                  Cam_ID: { eq: "${camId}" }
                }
                limit: 1000
                ${nextToken ? `nextToken: "${nextToken}"` : ''}
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
      const items = data?.data?.listSafeCHourlyData?.items || [];
      const nt = data?.data?.listSafeCHourlyData?.nextToken || null;
      pages++;

      console.log(`[${dbLocation}][${camId}] page ${pages}: ${items.length} items`);

      if (items.length > 0) {
        if (!foundStart) {
          tokenCache[cacheKey] = nextToken;
          foundStart = true;
        }
        allItems = [...allItems, ...items];

        const mostRecent = [...allItems].sort((a, b) =>
          new Date(b.Updated_Time).getTime() - new Date(a.Updated_Time).getTime()
        )[0];

        const ageHours = (Date.now() - new Date(mostRecent.Updated_Time).getTime()) / 3600000;
        if (ageHours < 24) {
          console.log(`[${dbLocation}][${camId}] recent data found, stopping`);
          break;
        }
      }

      if (foundStart && items.length === 0) break;
      if (!nt) break;
      nextToken = nt;
    }

    if (allItems.length === 0) return null;

    return [...allItems].sort((a, b) =>
      new Date(b.Updated_Time).getTime() - new Date(a.Updated_Time).getTime()
    )[0];

  } catch (error) {
    console.error(`getHourlyData error [${dbLocation}][${camId}]:`, error);
    return null;
  }
};

export default getHourlyData;