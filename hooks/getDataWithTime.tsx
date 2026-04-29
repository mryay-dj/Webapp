import { useState, useEffect } from 'react';
import { API_KEY } from "../hooks/config";

interface Item {
  Anomalies: string[];
  Anomaly_Count: string;
  id: number;
  Recorded_Time: string;
  Active_Cams: number;
  Cam_ID: string;
  People_Count: string;
}

interface FetchDataResult {
  latestRecord: Item | null;
}

const getDataWithTime = (endpoint: string, initialSelectedCamera: string): FetchDataResult => {
  const [latestRecord, setLatestRecord] = useState<Item | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string>(initialSelectedCamera);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-API-KEY': API_KEY,
          },
          body: JSON.stringify({
            operationName: 'listCameraData',
            query: `
              query listCameraData {
                listCameraData (filter: {Cam_ID: {eq: "${selectedCamera}" }, Recorded_Time: {ge: "2023-12-10 10:08:55"}}) {
                  items {
                    Anomalies
                    Anomaly_Count
                    id
                    Recorded_Time
                    Active_Cams
                    Cam_ID
                    People_Count
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const responseData = await response.json();
        const fetchedData = responseData?.data?.listCameraData?.items || [];
        console.log(fetchedData);
        const sortedData = [...fetchedData].sort((a, b) => b.id - a.id);
        setLatestRecord(sortedData.length > 0 ? sortedData[0] : null);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [endpoint, selectedCamera]);

  return { latestRecord };
};

export default getDataWithTime;
