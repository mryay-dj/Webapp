"use client";

import ChartFour from "@/components/Charts/ChartFour";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import React, { useState, useEffect } from "react";
import getHourlyData from "../../hooks/getHourlyData";
import Anomalies from "@/components/UIElements/Anamolies";
import Dropdown from "@/components/UIElements/Dropdown";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BirdEyeView = dynamic(() => import("@/components/Charts/BirdEyeView"), { ssr: false });
const Heatmap = dynamic(() => import("@/components/UIElements/Heatmap"), { ssr: false });

const options = ["7th Street Market", "ABC Store", "CPCC", "TeCSAR Lab", "Parking lot"];
const cams = ["Camera 1", "Camera 2", "Camera 3", "Camera 4", "Camera 5"];
const tabs = ["Time Chart", "Anomalies", "Cumulative People", "Visitor Analytics"];

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
  X_Coordinates?: number[];
  Y_Coordinates?: number[];
}

const cards = [
  { imageUrl: "/images/Anomalies/gun.png", count: 0, title: "Gun" },
  { imageUrl: "/images/Anomalies/massgathering.png", count: 0, title: "Mass Gathering" },
  { imageUrl: "/images/Anomalies/run.png", count: 0, title: "Running" },
  { imageUrl: "/images/Anomalies/bag.png", count: 0, title: "Bag Left" },
  { imageUrl: "/images/Anomalies/literring.png", count: 0, title: "Littering" },
  { imageUrl: "/images/Anomalies/slip.png", count: 0, title: "Slip" },
  { imageUrl: "/images/Anomalies/grunning.png", count: 1, title: "Group Running" },
  { imageUrl: "/images/Anomalies/fight.png", count: 0, title: "Fight" },
];

const Camera = () => {
  const router = useRouter();
  const [selectedCamera, setSelectedCamera] = useState("Camera 1");
  const [selectedLocation, setSelectedLocation] = useState("7th Street Market");
  const [activeTab, setActiveTab] = useState("Time Chart");
  const [latestRecord, setLatestRecord] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const record = await getHourlyData(selectedLocation, selectedCamera);
      setLatestRecord(record);
      console.log(`[Camera page] ${selectedLocation} ${selectedCamera}:`, record);
    } catch (err) {
      console.error("Camera page fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedCamera, selectedLocation]);

  return (
    <>
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-bodydark hover:text-black dark:hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return to Dashboard
        </button>
      </div>

      {/* Page title */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-medium text-black dark:text-white">
          {selectedCamera} : Overview
        </h2>
        <div className="flex-1 h-px bg-stroke dark:bg-strokedark" />
      </div>

      {/* Location + Camera dropdowns */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Dropdown options={options} title="Location" onChange={setSelectedLocation} />
        <Dropdown options={cams} title="Camera" onChange={setSelectedCamera} />
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-3 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6 overflow-hidden">
        {/* People */}
        <div className="flex items-center gap-3 px-6 py-5 border-r border-stroke dark:border-strokedark">
          <svg className="w-6 h-6 text-bodydark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <p className="text-2xl font-medium text-black dark:text-white">
              {latestRecord?.People_Count || "0"}
            </p>
            <p className="text-sm text-bodydark">People</p>
            {latestRecord?.Updated_Time && (
              <p className="text-xs text-gray-400">{latestRecord.Updated_Time} EST</p>
            )}
          </div>
        </div>

        {/* Anomalies */}
        <div className="flex items-center gap-3 px-6 py-5 border-r border-stroke dark:border-strokedark">
          <svg className="w-6 h-6 text-bodydark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-2xl font-medium text-black dark:text-white">
              {latestRecord?.Cumulative_Anomalies || "0"}
            </p>
            <p className="text-sm text-bodydark">Anomalies</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 px-6 py-5">
          <svg className="w-6 h-6 text-bodydark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.277A1 1 0 0121 8.65v6.7a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${latestRecord ? "bg-green-500" : "bg-gray-400"}`} />
              <p className="text-2xl font-medium text-black dark:text-white">
                {latestRecord ? "Live" : "No Data"}
              </p>
            </div>
            <p className="text-sm text-bodydark">Status</p>
          </div>
        </div>
      </div>

      {loading && <p className="text-xs text-gray-400 mb-2">Refreshing...</p>}

      {!loading && !latestRecord && (
        <div className="mb-4 rounded border border-yellow-400 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          No data found for <strong>{selectedLocation}</strong> — <strong>{selectedCamera}</strong>
        </div>
      )}

      {/* Camera Data section */}
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-base font-medium text-black dark:text-white">Camera Data</h3>
        <div className="flex-1 h-px bg-stroke dark:bg-strokedark" />
      </div>

      {/* Tabbed chart card */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex border-b border-stroke dark:border-strokedark px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-bodydark hover:text-black dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "Time Chart" && <ChartFour />}

          {activeTab === "Anomalies" && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-8">
                <ChartTwo />
              </div>
              <div className="col-span-12 xl:col-span-4">
                <Anomalies cards={cards} />
              </div>
              <div className="col-span-12">
                <Heatmap
                  xValues={latestRecord?.X_Coordinates}
                  yValues={latestRecord?.Y_Coordinates}
                />
              </div>
              <div className="col-span-12">
                <BirdEyeView
                  x={latestRecord?.X_Coordinates ?? []}
                  y={latestRecord?.Y_Coordinates ?? []}
                />
              </div>
            </div>
          )}

          {activeTab === "Cumulative People" && <ChartOne />}
          {activeTab === "Visitor Analytics" && <ChartThree />}
        </div>
      </div>
    </>
  );
};

export default Camera;