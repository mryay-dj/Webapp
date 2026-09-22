import { URL, API_KEY } from "./config";

const LOCATION_MAP: Record<string, string> = {
  'CPCC': 'CPCC',
  'TeCSAR Lab': 'TeCSAR Lab',
  'Parking lot': 'Parking lot',
  '7th Street Market': '7_Street_Market',
  'ABC Store': 'ABC Store',
  'VAPA-Center': 'VAPA-Center',
  'Bianco-Tower': 'Bianco-Tower',
  'CPCC_Merancas': 'CPCC_Merancas',
  'CPCC_Centrale': 'CPCC_Centrale',
};

export interface TimeSeriesItem {
  id: string;
  Recorded_Time: string;
  Cam_ID: string;
  Location: string;
  People_Count?: string;
  Cumulative_People?: string;
  Cumulative_Anomalies?: string;
  Hour?: string;
  Day?: string;
  Updated_Time?: string;
}

/**
 * Fetches ALL records for a location (optionally scoped to one camera)
 * within the last `hoursBack` hours. Unlike getHourlyData (which only
 * returns the single most recent record), this returns the full list
 * so charts can aggregate/bucket the data themselves.
 */
const getTimeSeriesData = async (
  location: string,
  hoursBack: number,
  camId?: string
): Promise<TimeSeriesItem[]> => {
  const dbLocation = LOCATION_MAP[location] ?? location;
  const cutoff = Date.now() - hoursBack * 3600000;

  let nextToken: string | null = null;
  let allItems: TimeSeriesItem[] = [];
  let pages = 0;
  const MAX_PAGES = 30;

  try {
    while (pages < MAX_PAGES) {
      const camFilter = camId ? `Cam_ID: { eq: "${camId}" }` : '';
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
                  ${camFilter}
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
                  Cumulative_People
                  Cumulative_Anomalies
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
      const items: TimeSeriesItem[] = data?.data?.listSafeCHourlyData?.items || [];
      const nt = data?.data?.listSafeCHourlyData?.nextToken || null;
      pages++;

      // Keep only items inside our time window
      const inRange = items.filter((item) => {
        if (!item.Updated_Time) return false;
        return new Date(item.Updated_Time).getTime() >= cutoff;
      });
      allItems = [...allItems, ...inRange];

      console.log(`[getTimeSeriesData][${dbLocation}] page ${pages}: ${items.length} items, ${inRange.length} in range`);

      if (!nt) break;
      nextToken = nt;
    }

    return allItems;
  } catch (error) {
    console.error(`getTimeSeriesData error [${dbLocation}]:`, error);
    return [];
  }
};

export default getTimeSeriesData;