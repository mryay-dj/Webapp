"use client";
import React, { useState, useEffect } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartThree from "../Charts/ChartThree";
import CumulativeChartOne from "../Charts/CumulativeChartOne";
import ChartTwo from "../Charts/ChartTwo";
import CardDataStats from "../CardDataStats";
import Anomalies from "../UIElements/Anamolies";
import getHourlyData from "../../hooks/getHourlyData";
import Dropdown from "../UIElements/Dropdown";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import newUserLocations from "../../hooks/newUserLocations";

const MapOne = dynamic(() => import("../Maps/MapOne"), { ssr: false });

interface Item {
  id: string;
  Recorded_Time: string;
  Cam_ID: string;
  Location: string;
  People_Count?: string;
  Average_People?: string;
  Cumulative_People?: string;
  Cumulative_Anomalies?: string;
  Maximum_people?: string;
  total_people?: string;
  Hour?: string;
  Day?: string;
  Updated_Time?: string;
}

const CAMERA_IDS = ["Camera 1", "Camera 2", "Camera 3", "Camera 4", "Camera 5", "Camera 6", "Camera 7", "Camera 8"];

const cards = [
  { imageUrl: "/images/Anomalies/gun.png", count: 0, title: "Gun" },
  { imageUrl: "/images/Anomalies/massgathering.png", count: 0, title: "Mass Gathering" },
  { imageUrl: "/images/Anomalies/run.png", count: 0, title: "Running" },
  { imageUrl: "/images/Anomalies/bag.png", count: 0, title: "Bag Left" },
  { imageUrl: "/images/Anomalies/literring.png", count: 0, title: "Littering" },
  { imageUrl: "/images/Anomalies/slip.png", count: 0, title: "Slip" },
  { imageUrl: "/images/Anomalies/grunning.png", count: 0, title: "Group Running" },
  { imageUrl: "/images/Anomalies/fight.png", count: 0, title: "Fight" },
];

function getCurrentTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  // Pull allowed locations from Cognito attribute
  const { allowedLocations, loading: loadingLocations } = newUserLocations();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [latestRecord, setLatestRecord] = useState<Item | null>(null);
  const [allRecords, setAllRecords] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Once locations load set the first one as default
  useEffect(() => {
    if (allowedLocations.length > 0 && !selectedLocation) {
      setSelectedLocation(allowedLocations[0]);
    }
  }, [allowedLocations]);

  useEffect(() => {
    if (!selectedLocation) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        CAMERA_IDS.map((cam) => getHourlyData(selectedLocation, cam))
      );
      const valid = results.filter(Boolean) as Item[];
      setAllRecords(valid);
      if (valid.length === 0) { setLatestRecord(null); return; }
      const latest = [...valid].sort((a, b) =>
        new Date(b.Updated_Time ?? 0).getTime() - new Date(a.Updated_Time ?? 0).getTime()
      );
      setLatestRecord(latest[0] || null);
    } catch (error) {
      console.error("fetchData error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPeople = allRecords.reduce(
    (sum, r) => sum + parseInt(r.People_Count ?? "0", 10), 0
  );

  const totalAnomalies = allRecords.reduce((max, r) => {
    const count = parseInt(r.Cumulative_Anomalies ?? "0", 10);
    return count > max ? count : max;
  }, 0);

  const handleCameraClick = (camId: string) => {
    router.push(`/camera?location=${encodeURIComponent(selectedLocation)}&cam=${encodeURIComponent(camId)}`);
  };

  // Show loading while checking permissions
  if (loadingLocations) {
    return <p className="text-xs text-gray-400 p-6">Checking access...</p>;
  }

  // Show error if no locations assigned
  if (allowedLocations.length === 0) {
    return (
      <div className="m-6 rounded border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
        You don't have access to any locations. Contact your administrator.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 items-center justify-center">
        {/* Only shows locations this user is allowed to see */}
        <Dropdown options={allowedLocations} title="Location" value={selectedLocation} onChange={setSelectedLocation} />
      </div>

      <br />

      {loading && <p className="text-xs text-gray-400 mb-2">Refreshing...</p>}

      {!loading && allRecords.length === 0 && (
        <div className="mb-4 rounded border border-yellow-400 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          No data found for <strong>{selectedLocation}</strong>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total Occupants"
          total={String(totalPeople)}
          rate={`${latestRecord?.Updated_Time || getCurrentTimestamp()} EST`}
        >
          <svg className="fill-primary dark:fill-white" width="50" height="50" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M256 106.6c20.6.1 37.3-16.6 37.3-37.3 0-20.6-16.7-37.3-37.3-37.3-20.6 0-37.3 16.7-37.3 37.3 0 20.6 16.7 37.3 37.3 37.3zM293.4 115h-74.8c-28.2 0-46.6 24.8-46.6 48.4V277c0 22 31 22 31 0V172h6v285.6c0 30.4 42 29.4 43 0V293h8v164.7c1.7 31.2 43 28.2 43-.1V172h5v105c0 22 32 22 32 0V163.4c0-23.5-18.5-48.4-46.6-48.4z" />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Anomalies"
          total={String(totalAnomalies)}
          rate="N/A"
        >
          <svg className="fill-primary dark:fill-white" width="35" height="35" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172 L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259 c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227 c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554 c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47 C281.638,399.11,270.06,411.018,256.498,411.018z" />
          </svg>
        </CardDataStats>

        <CardDataStats title="Active Cameras" total={`${allRecords.length}`} rate="">
          <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="11" r="9" strokeWidth="2" />
            <circle cx="10" cy="11" r="6" />
            <circle cx="10" cy="11" r="1.5" />
          </svg>
        </CardDataStats>
      </div>

      <h5 id="cameras" className="mt-4 mb-2 text-lg font-semibold text-black dark:text-white">
        Active Cameras
      </h5>

      <div className="mt-2 grid grid-cols-4 gap-4">
        {CAMERA_IDS.map((camId) => {
          const camData = allRecords.find((r) => r.Cam_ID === camId);
          return (
            <div
              key={camId}
              onClick={() => handleCameraClick(camId)}
              className="rounded-lg border border-stroke bg-white py-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark cursor-pointer hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-500">{camId}</p>
                <span className={`inline-block h-2 w-2 rounded-full ${camData ? "bg-green-500" : "bg-gray-400"}`} />
              </div>
              <svg className="fill-primary dark:fill-white mb-1" width="24" height="24" viewBox="0 0 512 512">
                <path d="M256 106.6c20.6.1 37.3-16.6 37.3-37.3 0-20.6-16.7-37.3-37.3-37.3-20.6 0-37.3 16.7-37.3 37.3 0 20.6 16.7 37.3 37.3 37.3zM293.4 115h-74.8c-28.2 0-46.6 24.8-46.6 48.4V277c0 22 31 22 31 0V172h6v285.6c0 30.4 42 29.4 43 0V293h8v164.7c1.7 31.2 43 28.2 43-.1V172h5v105c0 22 32 22 32 0V163.4c0-23.5-18.5-48.4-46.6-48.4z" />
              </svg>
              <h4 className="text-xl font-bold text-black dark:text-white">
                {camData?.People_Count || 0}
              </h4>
              <p className="text-xs text-gray-400">Occupants</p>
              {camData?.Updated_Time && (
                <p className="text-xs text-gray-300 mt-1">{camData.Updated_Time}</p>
              )}
            </div>
          );
        })}
      </div>

      <br />
      <h5 id="data-summary" className="text-lg font-semibold text-black dark:text-white">Data Summary</h5>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div id="time-chart" className="col-span-12">
          <ChartOne />
        </div>
        <div id="anomalies" className="col-span-12 xl:col-span-12">
          <ChartTwo />
        </div>
        <div className="col-span-15 xl:col-span-12">
          <Anomalies cards={cards} />
        </div>
        <div id="cumulative-people" className="col-span-12">
          <CumulativeChartOne />
        </div>
        <div id="visitor-analytics" className="col-span-12">
          <ChartThree />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;