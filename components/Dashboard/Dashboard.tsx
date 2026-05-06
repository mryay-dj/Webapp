"use client";
import React, { useState, useEffect } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartThree from "../Charts/ChartThree";

import CumulativeChartOne from "../Charts/CumulativeChartOne";
import ChartTwo from "../Charts/ChartTwo";
import CardDataStats from "../CardDataStats";
import Anomalies from "../UIElements/Anamolies";
import getData from "../../hooks/getData"
import Dropdown from "../UIElements/Dropdown";
import { ToastContainer } from 'react-toastify';
import dynamic from "next/dynamic";
import {API_KEY, URL, headers} from "../../hooks/config";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});
interface Item {
  Anomalies: string[];
  Anomaly_Count: string;
  id: number;
  Recorded_Time: string;
  Active_Cams: number;
  Cam_ID: string;
  People_Count: string;
  High : number, 
  Low : number, 
  Status : string,
  Seven_Five : number,
  Updated_Time : string, 
  Two_Five: number, 
  Location: string,
  X_Coordinates : number[]
  Y_Coordinates : number[]
}
const options = ['CPCC', 'TeCSAR Lab', 'Parking lot'];
const cards = [
  { imageUrl: '/images/Anomalies/gun.png', count: 0, title : "mass gathering" },
  { imageUrl:'/images/Anomalies/massgathering.png', count: 1 , title : "mass gathering"},
  { imageUrl: '/images/Anomalies/run.png', count: 0, title : "mass gathering" },
  { imageUrl: '/images/Anomalies/bag.png', count: 0 , title : "mass gathering"},
  { imageUrl: '/images/Anomalies/literring.png', count: 0, title : "mass gathering" },
  { imageUrl: '/images/Anomalies/slip.png', count: 0 , title : "mass gathering"},
  { imageUrl:'/images/Anomalies/grunning.png', count: 2, title : "mass gathering" },
  { imageUrl: '/images/Anomalies/fight.png', count: 0, title : "mass gathering" }
]; 
function getCurrentTimestamp() {
  const now = new Date();

  // Get year, month, day, hours, minutes, and seconds
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format the timestamp
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return timestamp;
}
const Dashboard: React.FC = () => {
  const endpoint = URL;
  const [selectedLocation, setSelectedLocation] = useState<string>('CPCC'); // Set default value to "Camera 1"
  const [latestRecord, setLatestRecord] = useState<Item | null>(null);

  useEffect(() => {
    fetchData();
  }, []); // Add dependencies to the useEffect dependency array

  const fetchData = async () => {
    try {
      const { latestRecord } = await getData(endpoint, "Camera 1");
      setLatestRecord(latestRecord);
      
    }
     catch (error) {
      // Handle error appropriately
      console.error('Error fetching data:', error);
    }
    
  };
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };
 
 
  return (
    <>
 <div className="grid grid-cols-1 items-center justify-center">
  <Dropdown options={options} title ="Location" onChange={handleLocationChange}/>
</div>


<br></br>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
        <CardDataStats title="People" total = {latestRecord?.People_Count || "47"} rate= {`${latestRecord?.Recorded_Time || getCurrentTimestamp() } EST`}>
          
        <svg
  className="fill-primary dark:fill-white"
  width="50"
  height="50"
  viewBox="0 0 512 512"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  
  <path
    d="M256 106.6c20.6.1 37.3-16.6 37.3-37.3 0-20.6-16.7-37.3-37.3-37.3-20.6 0-37.3 16.7-37.3 37.3 0 20.6 16.7 37.3 37.3 37.3zM293.4 115h-74.8c-28.2 0-46.6 24.8-46.6 48.4V277c0 22 31 22 31 0V172h6v285.6c0 30.4 42 29.4 43 0V293h8v164.7c1.7 31.2 43 28.2 43-.1V172h5v105c0 22 32 22 32 0V163.4c0-23.5-18.5-48.4-46.6-48.4z"
  />
</svg>

        </CardDataStats>
      
        <CardDataStats title="Anomalies" total={`${latestRecord?.Anomalies || "2"}`} rate="2.21%" levelDown>
        <svg
  className="fill-primary dark:fill-white"
  width="35"
  height="35"
  viewBox="0 0 512 512"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
<path d="M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172 L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259 c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227 c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554 c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47 C281.638,399.11,270.06,411.018,256.498,411.018z"></path> 
</svg>


        </CardDataStats>
        <CardDataStats title="Active Cameras" total={`${latestRecord?.Active_Cams || 4}`} rate="" >
        <svg
  className="fill-primary dark:fill-white"
  width="20"
  height="22"
  viewBox="0 0 20 22"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  {/* Outer circle */}
  <circle cx="10" cy="11" r="9" stroke="" strokeWidth="2" />
  
  {/* Inner circle */}
  <circle cx="10" cy="11" r="6" fill="" />
  
  {/* Dot */}
  <circle cx="10" cy="11" r="1.5" fill="" />
</svg>


        </CardDataStats>
      </div>
      {/* Live Camera Grid */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        {[
        { id: "Camera 1", people: 34 },
        { id: "Camera 2", people: 48 },
        { id: "Camera 3", people: 53 },
        { id: "Camera 4", people: 18 },
      ].map((cam) => (
      <div key={cam.id} className="rounded-lg border border-stroke bg-white py-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-sm font-medium text-gray-500">{cam.id}</p>
        <h4 className="mt-2 text-xl font-bold text-black dark:text-white">{cam.people}</h4>
        <p className="text-xs text-gray-400">People</p>
      </div>
    ))}
    </div>

      <br></br>
      <h5>Data Summary </h5>



      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      
        <ChartOne />
        <ChartTwo />
        <Anomalies cards={cards} />
        <CumulativeChartOne/>
        <ChartThree />
        <div className="col-span-12 xl:col-span-8">
       <ToastContainer/>
        </div>
      </div>
     
    </>
  );
};

export default Dashboard;
