"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Dropdown from "@/components/UIElements/Dropdown";
import React, { useState, useEffect } from "react";
import getS3Videos, { S3Video } from "../../hooks/getS3Videos";
import getS3Heatmap from "../../hooks/getS3Heatmap";

const options = ["7th Street Market", "ABC Store", "CPCC", "TeCSAR Lab", "Parking lot", "VAPA-Center", "Bianco-Tower", "CPCC_Merancas", "CPCC_Centrale"];
const cameraOptions = ["All Cameras", "Camera 1", "Camera 2", "Camera 3", "Camera 4", "Camera 5", "Camera 6", "Camera 7", "Camera 8"];
const filterPills = ["All", "Today", "This Week", "This Month"];

const Events = () => {
  const [selectedLocation, setSelectedLocation] = useState("7th Street Market");
  const [selectedCam, setSelectedCam] = useState("All Cameras");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<S3Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<S3Video | null>(null);
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  // Fetch videos when location changes
  useEffect(() => {
    const fetch = async () => {
      setLoadingVideos(true);
      const results = await getS3Videos(selectedLocation);
      setVideos(results);
      setLoadingVideos(false);
    };
    fetch();
  }, [selectedLocation]);

  // Fetch heatmap when video selected
  useEffect(() => {
    if (selectedVideo) {
      getS3Heatmap(selectedVideo.location, selectedVideo.camera, selectedVideo.date)
        .then(setHeatmapUrl);
    }
  }, [selectedVideo]);

  const filtered = videos.filter((v) => {
    const camMatch = selectedCam === "All Cameras" || v.camera === selectedCam;
    const searchMatch = v.fileName.toLowerCase().includes(search.toLowerCase());
    
    if (activeFilter === "Today") {
      const today = new Date().toLocaleDateString('en-CA');
      return camMatch && searchMatch && v.date === today;
    }
    if (activeFilter === "This Week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return camMatch && searchMatch && new Date(v.date) >= weekAgo;
    }
    if (activeFilter === "This Month") {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return camMatch && searchMatch && new Date(v.date) >= monthAgo;
    }
    return camMatch && searchMatch;
  });

  return (
    <>
      <Breadcrumb pageName="Events" />

      {/* Top bar */}
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

      {/* Filter pills */}
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
      </div>

      {/* Loading state */}
      {loadingVideos && (
        <p className="text-sm text-gray-400 mb-4">Loading videos from S3...</p>
      )}

      {/* No videos found */}
      {!loadingVideos && filtered.length === 0 && (
        <div className="rounded border border-yellow-400 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          No recordings found for <strong>{selectedLocation}</strong>
        </div>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((video, idx) => (
          <div
            key={idx}
            onClick={() => { setSelectedVideo(video); setFeedback(null); setHeatmapUrl(null); }}
            className="cursor-pointer group rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark overflow-hidden hover:border-primary transition-colors"
          >
            <div className="bg-gray-2 dark:bg-meta-4 flex items-center justify-center h-32 relative">
              <svg className="w-10 h-10 text-bodydark group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-5.197-3.03A1 1 0 008 9.03v5.94a1 1 0 001.555.832l5.197-3.03a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-black dark:text-white truncate">{video.camera}</p>
              <p className="text-xs text-bodydark">{video.date}</p>
              <p className="text-xs text-gray-400 truncate">{video.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-boxdark rounded-sm shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
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

            <div className="flex flex-1 overflow-hidden">
              {/* Left sidebar */}
              <div className="w-56 shrink-0 bg-gray-2 dark:bg-meta-4 border-r border-stroke dark:border-strokedark p-4 overflow-y-auto flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-black dark:text-white mb-1">{selectedVideo.fileName}</p>
                  <p className="text-xs text-bodydark">Video Stats</p>
                </div>

                <div className="rounded border border-stroke dark:border-strokedark bg-white dark:bg-boxdark text-xs divide-y divide-stroke dark:divide-strokedark">
                  {[
                    ["Location", selectedVideo.location],
                    ["Camera", selectedVideo.camera],
                    ["Date", selectedVideo.date],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between px-3 py-2">
                      <span className="text-bodydark">{k} :</span>
                      <span className="text-black dark:text-white font-medium text-right max-w-[100px] truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Real heatmap from S3 */}
                <div>
                  <p className="text-xs font-medium text-black dark:text-white mb-2">View Heatmap</p>
                  {heatmapUrl ? (
                    <img
                      src={heatmapUrl}
                      alt="heatmap"
                      className="w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-20 bg-meta-4 rounded-lg flex items-center justify-center">
                      <p className="text-xs text-gray-400">No heatmap for this date</p>
                    </div>
                  )}
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

              {/* Right: actual video player */}
              <div className="flex-1 flex flex-col bg-black">
                <div className="flex-1 flex items-center justify-center min-h-[240px]">
                  <video
                    controls
                    className="w-full h-full max-h-[400px] object-contain"
                    src={selectedVideo.url}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>

                <div className="bg-gray-900 px-4 py-2">
                  <p className="text-white text-sm font-medium truncate">
                    {selectedVideo.camera} — {selectedVideo.location}
                  </p>
                  <p className="text-gray-400 text-xs">{selectedVideo.date}</p>
                </div>

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
                  <button className="ml-auto px-5 py-1.5 rounded text-sm font-medium bg-primary text-white hover:bg-opacity-90 transition-colors">
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