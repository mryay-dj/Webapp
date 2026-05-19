"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Dropdown from "@/components/UIElements/Dropdown";
import React, { useState } from "react";

const options = ["CPCC", "TeCSAR Lab", "Parking lot"];
const cameraOptions = ["All Cameras", "Camera 1", "Camera 2", "Camera 3", "Camera 4"];
const filterPills = ["All", "Today", "This Week", "This Month"];

// Sample recordings data — replace with real API data
const sampleRecordings = [
  { id: 1, cam: "Camera 1", title: "Anomaly identified at CPCC on 8 Jan 2024 10:30 AM", description: "A bag left behind anomaly has been identified at this location", timestamp: "00:05:32", date: "2024-01-08", location: "CPCC", people: 3, anomalies: "Bag left behind" },
  { id: 2, cam: "Camera 4", title: "Anomaly identified at CPCC on 8 Jan 2024 11:00 AM", description: "A mass gathering anomaly has been identified at this location", timestamp: "00:10:15", date: "2024-01-08", location: "CPCC", people: 12, anomalies: "Mass gathering" },
  { id: 3, cam: "Camera 3", title: "Anomaly identified at CPCC on 8 Jan 2024 01:15 PM", description: "A running anomaly has been identified at this location", timestamp: "00:03:44", date: "2024-01-08", location: "CPCC", people: 2, anomalies: "Running" },
  { id: 4, cam: "Camera 3", title: "Anomaly identified at CPCC on 8 Jan 2024 02:30 PM", description: "A slip and fall anomaly has been detected", timestamp: "00:07:21", date: "2024-01-08", location: "CPCC", people: 1, anomalies: "Slip and fall" },
  { id: 5, cam: "Camera 1", title: "Anomaly identified at CPCC on 9 Jan 2024 09:00 AM", description: "A mass gathering anomaly has been identified at this location", timestamp: "00:12:05", date: "2024-01-09", location: "CPCC", people: 8, anomalies: "Mass gathering" },
  { id: 6, cam: "Camera 2", title: "Anomaly identified at CPCC on 9 Jan 2024 10:45 AM", description: "A littering anomaly has been detected at this location", timestamp: "00:04:33", date: "2024-01-09", location: "CPCC", people: 2, anomalies: "Littering" },
  { id: 7, cam: "Camera 4", title: "Anomaly identified at CPCC on 9 Jan 2024 12:00 PM", description: "A fight anomaly has been detected at this location", timestamp: "00:08:17", date: "2024-01-09", location: "CPCC", people: 4, anomalies: "Fight" },
  { id: 8, cam: "Camera 2", title: "Anomaly identified at CPCC on 9 Jan 2024 03:10 PM", description: "A bag left behind anomaly has been identified at this location", timestamp: "00:06:50", date: "2024-01-09", location: "CPCC", people: 1, anomalies: "Bag left behind" },
  { id: 9, cam: "Camera 3", title: "Anomaly identified at CPCC on 10 Jan 2024 08:20 AM", description: "A running anomaly has been identified at this location", timestamp: "00:02:10", date: "2024-01-10", location: "CPCC", people: 3, anomalies: "Running" },
  { id: 10, cam: "Camera 1", title: "Anomaly identified at CPCC on 10 Jan 2024 11:30 AM", description: "A slip and fall anomaly has been detected", timestamp: "00:05:45", date: "2024-01-10", location: "CPCC", people: 1, anomalies: "Slip and fall" },
  { id: 11, cam: "Camera 4", title: "Anomaly identified at CPCC on 10 Jan 2024 01:00 PM", description: "A mass gathering anomaly has been identified at this location", timestamp: "00:09:30", date: "2024-01-10", location: "CPCC", people: 9, anomalies: "Mass gathering" },
  { id: 12, cam: "Camera 2", title: "Anomaly identified at CPCC on 10 Jan 2024 04:15 PM", description: "A littering anomaly has been detected at this location", timestamp: "00:03:22", date: "2024-01-10", location: "CPCC", people: 2, anomalies: "Littering" },
];

// Heatmap color grid (static visual, replace with real data)
const heatmapColors = [
  ["#4ade80","#86efac","#fbbf24","#f97316","#fb923c"],
  ["#4ade80","#4ade80","#86efac","#fbbf24","#f97316"],
  ["#86efac","#4ade80","#4ade80","#86efac","#fbbf24"],
];

interface Recording {
  id: number; cam: string; title: string; description: string;
  timestamp: string; date: string; location: string; people: number; anomalies: string;
}

const Events = () => {
  const [selectedLocation, setSelectedLocation] = useState("CPCC");
  const [selectedCam, setSelectedCam] = useState("All Cameras");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Recording | null>(null);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const filtered = sampleRecordings.filter((r) => {
    const camMatch = selectedCam === "All Cameras" || r.cam === selectedCam;
    const searchMatch = r.title.toLowerCase().includes(search.toLowerCase());
    return camMatch && searchMatch;
  });

  return (
    <>
      <Breadcrumb pageName="Events" />

      {/* Top bar: search + location */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-bodydark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search recordings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <Dropdown options={options} title="Location" onChange={setSelectedLocation} />
      </div>

      {/* Filter pills + camera filter */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === pill
                  ? "bg-primary text-white"
                  : "bg-white border border-stroke text-bodydark dark:bg-boxdark dark:border-strokedark hover:border-primary hover:text-primary"
              }`}
            >
              {pill}
            </button>
          ))}
          {/* Camera filter pill */}
          <select
            value={selectedCam}
            onChange={(e) => setSelectedCam(e.target.value)}
            className="px-4 py-1.5 rounded-full text-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark focus:outline-none focus:border-primary text-bodydark"
          >
            {cameraOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Grid/List toggle */}
        <button className="p-2 rounded border border-stroke dark:border-strokedark">
          <svg className="w-4 h-4 text-bodydark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            onClick={() => { setSelectedVideo(rec); setFeedback(null); }}
            className="cursor-pointer group rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark overflow-hidden hover:border-primary transition-colors"
          >
            {/* Thumbnail */}
            <div className="bg-gray-2 dark:bg-meta-4 flex items-center justify-center h-32 relative">
              <svg className="w-10 h-10 text-bodydark group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-5.197-3.03A1 1 0 008 9.03v5.94a1 1 0 001.555.832l5.197-3.03a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Label */}
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-black dark:text-white truncate">{rec.cam}</p>
              <p className="text-xs text-bodydark">{rec.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-boxdark rounded-sm shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stroke dark:border-strokedark">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-bodydark hover:text-black dark:hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-black dark:text-white">Return to Recordings</span>
              </div>
              <button onClick={() => setSelectedVideo(null)} className="text-bodydark hover:text-black dark:hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left sidebar */}
              <div className="w-56 shrink-0 bg-gray-2 dark:bg-meta-4 border-r border-stroke dark:border-strokedark p-4 overflow-y-auto flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-black dark:text-white mb-1">Cam_Ftg.mp4</p>
                  <p className="text-xs text-bodydark">Video Stats</p>
                </div>

                {/* Stats box */}
                <div className="rounded border border-stroke dark:border-strokedark bg-white dark:bg-boxdark text-xs divide-y divide-stroke dark:divide-strokedark">
                  {[
                    ["Location", selectedVideo.location],
                    ["Camera", selectedVideo.cam],
                    ["Date", selectedVideo.date],
                    ["Timestamp", selectedVideo.timestamp],
                    ["People", String(selectedVideo.people)],
                    ["Detected Anomalies", selectedVideo.anomalies],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between px-3 py-2">
                      <span className="text-bodydark">{k} :</span>
                      <span className="text-black dark:text-white font-medium text-right max-w-[100px] truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Heatmap */}
                <div>
                  <p className="text-xs font-medium text-black dark:text-white mb-2">View Heatmap</p>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                    {heatmapColors.flat().map((color, i) => (
                      <div key={i} className="h-6 rounded-sm" style={{ background: color }} />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-black dark:text-white mb-1">Description</p>
                  <textarea
                    rows={3}
                    placeholder="Enter description here"
                    className="w-full text-xs rounded border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-2 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Right: video + controls */}
              <div className="flex-1 flex flex-col bg-black">
                {/* Video placeholder */}
                <div className="flex-1 flex items-center justify-center min-h-[240px]">
                  <svg className="w-16 h-16 text-white opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-5.197-3.03A1 1 0 008 9.03v5.94a1 1 0 001.555.832l5.197-3.03a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Video info */}
                <div className="bg-gray-900 px-4 py-2">
                  <p className="text-white text-sm font-medium truncate">{selectedVideo.title}</p>
                  <p className="text-gray-400 text-xs">{selectedVideo.description}</p>
                </div>

                {/* Like / Dislike / Submit */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800">
                  <button
                    onClick={() => setFeedback("like")}
                    className={`px-5 py-1.5 rounded text-sm font-medium transition-colors ${
                      feedback === "like" ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    Like
                  </button>
                  <button
                    onClick={() => setFeedback("dislike")}
                    className={`px-5 py-1.5 rounded text-sm font-medium transition-colors ${
                      feedback === "dislike" ? "bg-red-700 text-white" : "bg-red-500 text-white hover:bg-red-700"
                    }`}
                  >
                    Dislike
                  </button>
                  <button className="ml-auto px-5 py-1.5 rounded text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Events;