"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChartFour from "@/components/Charts/ChartFour";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import OccupancyIndicator from "@/components/Charts/OccupancyIndicator";
import React, { useState, useEffect } from 'react';
import getData from "../../hooks/getData"
import LinearGuage from "@/components/UIElements/LinearGuageChart";
import Anomalies from "@/components/UIElements/Anamolies";
import {API_KEY, URL} from "../../hooks/config";
import heatmap from 'heatmap.js';
import CardDataStats from  "@/components/CardDataStats";
import Dropdown from "@/components/UIElements/Dropdown"; 
import BirdEyeView from "@/components/Charts/BirdEyeView";
import { Metadata } from "next";
 const metadata: Metadata = {
  title: "AI powered Safe Community App",
  description: "AI powered application to improve safety in communities and Universities.",
  // other metadata
};

const options = ['CPCC', 'TeCSAR Lab', 'Parking lot'];
const cams = ['Camera 1', 'Camera 2', 'Camera 3','Camera 4'];

const camera = () => {
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
  const [occupancyValues, setOccupancyValues] = useState({
    low: 0,
    current: 50,
    high: 100,
  });

  const [currentData, setCurrentData] = useState<Array<{ x: number; y: number; value: number }>>([]);

  const handleUpdateValues = () => {
    // Simulating the update of values
    setOccupancyValues({
      low: 0,
      current: Math.floor(Math.random() * 100),
      high: 100,
    });
  };

  const [selectedCamera, setSelectedCamera] = useState<string>('Camera 1');
  const [selectedLocation, setSelectedLocation] = useState<string>('CPCC');
  const [fdata, setData] = useState<Item[]>([]);
  const [latestRecord, setLatestRecord] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const endpoint = URL;

  const fetchData = async () => {
    try {
      const { latestRecord } = await getData(endpoint, selectedCamera);
      setLatestRecord(latestRecord);
      
      setLoading(false);
      
    }
     catch (error) {
      // Handle error appropriately
      console.error('Error fetching data:', error);
    }
    
  };
  const handleCameraChange = (camera: string) => {
   if (selectedCamera != camera ){
    setSelectedCamera(camera);
   }
   // fetchData(); // Call fetchData when camera changes
  };

  useEffect(() => {
    fetchData(); // Call fetchData function when the component mounts
  console.log("In Use Effect");


  const intervalId = setInterval(fetchData, 5000);

  // Cleanup interval on component unmount
  return () => clearInterval(intervalId);
    
  }, [selectedCamera, selectedLocation,updateHeatMap]); // Add dependencies to the useEffect dependency array
  updateHeatMap()
  function updateHeatMap(){
      
    const container = document.getElementById('heatmapContainer');
    if (container && latestRecord?.X_Coordinates.length && latestRecord?.Y_Coordinates.length && latestRecord?.X_Coordinates.length === latestRecord?.Y_Coordinates.length) {
      const heatmapInstance = heatmap.create({
        container,
        radius: 30,
        maxOpacity: 0.5,
        minOpacity: 0,
        blur: 0.9,
        gradient: {
          '.4': 'blue',
          '.6': 'cyan',
          '.8': 'lime',
          '.95': 'yellow',
          '1': 'red',
        },
      });
      let x = latestRecord?.X_Coordinates;
      let y = latestRecord?.Y_Coordinates;
      var newDataArray = [];
      
      if (x && y && x.length === y.length) {
        
        for (let i = 0; i < x.length; i++) {
          // Access each data point at the same index in both arrays
         
          var dataPoint = {
            x:  normalizeCoordinate(x[i],0,400,0,100), // x coordinate of the datapoint, a number
            y: normalizeCoordinate(y[i],0,250,0,100) , // y coordinate of the datapoint, a number
            value: 1,// the value at datapoint(x, y)
          };
          
          // Append the data point to the new array
          newDataArray.push(  dataPoint );
        }
      }
      heatmapInstance.addData(newDataArray);
    
  }
  }
  function normalizeCoordinate(originalValue : number, minOriginal: number, maxOriginal: number, minNew: number, maxNew: number) {
    return ((originalValue - minOriginal) / (maxOriginal - minOriginal)) * (maxNew - minNew) + minNew;
  }
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
  
  // ... (rest of the code remains the same)

  const handleLocationChange = (location: string) => {
    console.log(location );
    if (location !== selectedLocation) {
      setSelectedLocation(location);
    }
  }
     console.log(selectedCamera);
  const cards = [
    { imageUrl: '/images/Anomalies/gun.png', count: 0, title : "mass gathering" },
    { imageUrl:'/images/Anomalies/massgathering.png', count: 0 , title : "mass gathering"},
    { imageUrl: '/images/Anomalies/run.png', count: 0, title : "mass gathering" },
    { imageUrl: '/images/Anomalies/bag.png', count: 0 , title : "mass gathering"},
    { imageUrl: '/images/Anomalies/literring.png', count: 0, title : "mass gathering" },
    { imageUrl: '/images/Anomalies/slip.png', count: 0 , title : "mass gathering"},
    { imageUrl:'/images/Anomalies/grunning.png', count: 1, title : "mass gathering" },
    { imageUrl: '/images/Anomalies/fight.png', count: 0, title : "mass gathering" }
  ]; 
  return (
    <>
      <Breadcrumb pageName="Camera" />
      <div>
      <div className="grid grid-cols-2  gap-4 items-center justify-center">
  <Dropdown options={options} title="Location" onChange={handleLocationChange} />
  <Dropdown options={cams} title="Camera" onChange={handleCameraChange} />


  <br></br>
</div>
              </div> <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
              <CardDataStats title="People" total =  {`${latestRecord?.People_Count || "0"}`} rate= {`${latestRecord?.Updated_Time || getCurrentTimestamp()} EST`}>
        
      
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
        {/* <OccupancyIndicator occupancyPercent= {`${latestRecord?.People_Count || "0"}`}/> */}
        <OccupancyIndicator low={`${latestRecord?.Low || "0"}`} high={`${latestRecord?.High || "10"}`} tf={`${latestRecord?.Two_Five || "2"}`} sf={`${latestRecord?.Seven_Five || "7"}`} people={`${latestRecord?.People_Count || "."}`}/>

        
        <CardDataStats title="Anomalies" total={`${latestRecord?.Anomaly_Count || "2"}`} rate="2.21%" levelDown>
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
  </div>
  
  <br></br>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartFour />
        </div>
        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div>
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Heat Map</h5>
        </div>
      </div>  
    
      {latestRecord && (
  <div id="heatmapContainer" style={{ width: '100%', height: '350px', border: '1px solid #000', overflow: 'hidden' }} />
)}
    </div>
        <BirdEyeView x={latestRecord?.X_Coordinates} y={latestRecord?.Y_Coordinates} />
   
        <ChartTwo />
        <Anomalies cards={cards} />
        <ChartOne />
        <ChartThree />
 
      </div>
    </>
  );
};

export default camera;
