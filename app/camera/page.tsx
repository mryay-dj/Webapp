"use client";

import React, { useState, useEffect, Suspense } from "react";
import getHourlyData from "../../hooks/getHourlyData";
import getS3Heatmap from "../../hooks/getS3Heatmap";
import Anomalies from "@/components/UIElements/Anamolies";
import Dropdown from "@/components/UIElements/Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ChartFour from "@/components/Charts/ChartFour";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import newUserLocations from "../../hooks/newUserLocations";

const BirdEyeView = dynamic(() => import("@/components/Charts/BirdEyeView"), { ssr: false });

const cams = ["Camera 1", "Camera 2", "Camera 3", "Camera 4", "Camera 5", "Camera 6", "Camera 7", "Camera 8"];
const tabs = ["Anomalies", "Visitor Analytics"];

interface Item {
  id: string;
  Recorded_Time: string;
  Cam_ID: string;
  Location: string;
  People_Count?: string;
  Cumulative_Anomalies?: string;
  Updated_Time?: string;
}

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

function CameraInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { allowedLocations, loading: loadingLocations } = newUserLocations();

  // Read camera and location directly from URL params
  const [selectedCamera, setSelectedCamera] = useState(
    searchParams.get("cam") || "Camera 1"
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );

  const [activeTab, setActiveTab] = useState("Anomalies");
  const [latestRecord, setLatestRecord] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullHeatmap, setShowFullHeatmap] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState("Heat Map");
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);

  // Once allowed locations load, if no location set from URL use first allowed
  useEffect(() => {
    if (!selectedLocation && allowedLocations.length > 0) {
      setSelectedLocation(allowedLocations[0]);
    }
  }, [allowedLocations]);

  const fetchData = async () => {
    if (!selectedLocation) return;
    setLoading(true);
    try {
      const record = await getHourlyData(selectedLocation, selectedCamera);
      setLatestRecord(record);
    } catch (err) {
      console.error("Camera fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmap = async () => {
    if (!selectedLocation) return;
    const url = await getS3Heatmap(selectedLocation, selectedCamera);
    setHeatmapUrl(url);
  };

  useEffect(() => {
    if (!selectedLocation) return;
    fetchData();
    fetchHeatmap();
    const dataInterval = setInterval(fetchData, 5000);
    const heatmapInterval = setInterval(fetchHeatmap, 300000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(heatmapInterval);
    };
  }, [selectedCamera, selectedLocation]);

  const peopleCount = parseInt(latestRecord?.People_Count ?? "0", 10);

  if (loadingLocations) {
    return <p className="text-xs text-gray-400 p-6">Checking access...</p>;
  }

  return (
    <>
      {/* FULL HEATMAP MODAL */}
      {showFullHeatmap && (
        <div className="fixed inset-0 z-50 flex flex-col bg-boxdark">
          <div className="flex items-center justify-between px-6 py-4 border-b border-strokedark">
            <button
              onClick={() => setShowFullHeatmap(false)}
              className="flex items-center gap-2 text-white hover:text-primary transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{selectedCamera} : Overview</span>
            </button>

            <div className="flex items-center gap-4">
              <select
                value={heatmapMode}
                onChange={(e) => setHeatmapMode(e.target.value)}
                className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium"
              >
                <option>Heat Map</option>
                <option>Dwell Times</option>
                <option>Exit / Entry Counts</option>
                <option>Movement Patterns</option>
                <option>Speed & Trajectory</option>
              </select>

              {/* X close button */}
              <button
                onClick={() => setShowFullHeatmap(false)}
                className="text-white hover:text-red-400 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {heatmapUrl ? (
              <img src={heatmapUrl} alt="heatmap" className="w-full h-full object-contain bg-black" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <p className="text-white font-medium">No heatmap available</p>
                  <p className="text-gray-400 text-sm mt-1">{selectedLocation} — {selectedCamera}</p>
                  <p className="text-gray-500 text-xs mt-1">Try Camera 8 for latest data</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-boxdark border-t border-strokedark px-6 py-4">
            <div className="flex items-center gap-4 mb-3">
              <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium">Static</button>
              <div className="flex-1 flex justify-center items-center gap-4">
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                </button>
                <button className="bg-primary w-8 h-8 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                </button>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                </button>
              </div>
              <div className="flex gap-2">
                {["24 hr", "12 hr", "6 hr"].map((t) => (
                  <button key={t} className="text-white text-sm px-3 py-1.5 rounded-lg border border-strokedark hover:border-primary hover:text-primary transition">{t}</button>
                ))}
              </div>
            </div>
            <div className="relative w-full h-10 bg-meta-4 rounded-lg overflow-hidden flex items-center px-2">
              <div className="absolute left-0 top-0 h-full w-1/3 bg-primary opacity-50 rounded-lg" />
              <div className="absolute left-1/3 top-0 h-full w-0.5 bg-white" />
              <div className="relative z-10 flex justify-between w-full">
                {["1 PM", "3 PM", "5 PM", "7 PM", "9 PM", "11 PM", "1 AM", "3 AM"].map((t) => (
                  <span key={t} className="text-gray-400 text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-bodydark hover:text-black dark:hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return to Dashboard
        </button>
      </div>

      {/* Page title shows which camera you're viewing */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-medium text-black dark:text-white whitespace-nowrap">
          {selectedCamera} : Overview
        </h2>
        <div className="flex-1 h-px bg-stroke dark:bg-strokedark" />
      </div>

      {/* Dropdowns — location uses allowedLocations only */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Dropdown
          options={allowedLocations.length > 0 ? allowedLocations : []}
          title="Location"
          onChange={setSelectedLocation}
        />
        <Dropdown
          options={cams}
          title="Camera"
          onChange={setSelectedCamera}
        />
      </div>

      {!loading && !latestRecord && selectedLocation && (
        <div className="mb-4 rounded border border-yellow-400 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          No data for <strong>{selectedLocation}</strong> — <strong>{selectedCamera}</strong>
        </div>
      )}

      {/* TOP ROW */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 h-full">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-base font-medium text-black dark:text-white whitespace-nowrap">
                {selectedCamera} : Overview
              </h3>
              <div className="flex-1 h-px bg-stroke dark:bg-strokedark" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 dark:bg-meta-4 p-4">
                <svg className="w-7 h-7 text-bodydark mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-3xl font-bold text-black dark:text-white">{peopleCount}</p>
                <p className="text-sm text-bodydark mt-1">People</p>
                {latestRecord?.Updated_Time && (
                  <p className="text-xs text-gray-400 mt-1">{latestRecord.Updated_Time} EST</p>
                )}
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-meta-4 p-4">
                <svg className="w-7 h-7 text-bodydark mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {latestRecord?.Cumulative_Anomalies || "0"}
                </p>
                <p className="text-sm text-bodydark mt-1">Anomalies</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 h-full">
            <h3 className="text-base font-medium text-black dark:text-white mb-2">View Heatmap</h3>
            <div
              className="relative rounded-lg overflow-hidden cursor-pointer"
              style={{ height: "150px" }}
              onClick={() => setShowFullHeatmap(true)}
            >
              {heatmapUrl ? (
                <img src={heatmapUrl} alt="heatmap preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-meta-4 flex items-center justify-center rounded-lg">
                  <p className="text-gray-400 text-xs text-center px-4">
                    No heatmap available<br />Try Camera 8
                  </p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 py-2 flex justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-sm font-medium text-black dark:text-white">Camera Data</h3>
        <div className="flex-1 h-px bg-stroke dark:bg-strokedark" />
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 mb-6">
        <h4 className="text-base font-medium text-black dark:text-white mb-4">Cumulative People</h4>
        <ChartOne />
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 mb-6">
        <h4 className="text-base font-medium text-black dark:text-white mb-4">Time Chart</h4>
        <ChartFour />
      </div>

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
          {activeTab === "Anomalies" && (
            <div className="grid grid-cols-15 gap-3">
              <div className="col-span-12 xl:col-span-8"><ChartTwo /></div>
              <div className="col-span-12 xl:col-span-8"><Anomalies cards={cards} /></div>
            </div>
          )}
          {activeTab === "Visitor Analytics" && <ChartThree />}
        </div>
      </div>
    </>
  );
}

export default function Camera() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading...</div>}>
      <CameraInner />
    </Suspense>
  );
}