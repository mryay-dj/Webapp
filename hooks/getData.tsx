import { useState } from 'react';
import { API_KEY, URL } from "../hooks/config";
import moment from 'moment';

interface Item {
  Anomalies: string[];
  Anomaly_Count: string;
  id: number;
  Recorded_Time: string;
  Active_Cams: number;
  Cam_ID: string;
  People_Count: string;
  High: number,
  Low: number,
  Status: string,
  Seven_Five: number,
  Updated_Time: string,
  Two_Five: number,
  Location: string,
  X_Coordinates: number[];
  Y_Coordinates: number[];
}

interface FetchDataResult {
  latestRecord: Item | null;
}

const getData = async (endpoint: string, selectedCamera: string): Promise<FetchDataResult> => {
  try {
    // Calculate the Recorded_Time with current time - 5 minutes
    const currentTimeMinus10Seconds = moment().subtract(10, 'seconds').format('YYYY-MM-DD HH:mm:ss');

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
            listCameraData (filter: {Cam_ID: {eq: "${selectedCamera}"}}, limit: 10000) {
              items {
                Anomalies
                Anomaly_Count
                id
                Recorded_Time
                Active_Cams
                Cam_ID
                People_Count
                Status
                X_Coordinates
                Y_Coordinates
                High
                Low
                Location
                Two_Five
                Updated_Time
                Seven_Five
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
    console.log("RAW RESPONSE:", responseData);
    const fetchedData = (responseData?.data?.listCameraData?.items || []).map((item: any) => ({
      ...item,
      X_Coordinates: item.X_Coordinates?.map((x: string) => Number(x)) || [],
      Y_Coordinates: item.Y_Coordinates?.map((y: string) => Number(y)) || [],
    }));
    
    console.log("Selected Camera:", selectedCamera);
    console.log("FULL DATA:", fetchedData);
    console.log("FIRST ITEM:", fetchedData[0]);

    if (fetchedData.length > 0) {
      console.log("Camera:", fetchedData[0].Cam_ID);
      console.log("Location:", fetchedData[0].Location);
      console.log("People:", fetchedData[0].People_Count);
      console.log("FULL DATA:", fetchedData);
      console.log("FIRST ITEM:", fetchedData[0]);

}


    const sortedData = [...fetchedData].sort((a, b) => b.id - a.id);
    const latestRecord = sortedData.length > 0 ? sortedData[0] : null;
    console.log("LATEST RECORD:", latestRecord);
    return { latestRecord, items: sortedData };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { latestRecord: null };
  }
};

export default getData;

