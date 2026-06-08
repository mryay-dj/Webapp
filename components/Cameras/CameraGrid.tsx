"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface CameraData {
  Cam_ID: string;
  People_Count?: string;
  Updated_Time?: string;
}

interface CameraGridProps {
  allRecords: CameraData[];
  selectedLocation: string;
}



const CAMERA_IDS = ["Camera 1", "Camera 2", "Camera 3", "Camera 4", "Camera 5"];

const CameraGrid: React.FC<CameraGridProps> = ({ allRecords, selectedLocation }) => {
  const router = useRouter();
  return (
    <>
      <h5 className="mt-4 mb-2 text-lg font-semibold text-black dark:text-white">
        Active Cameras
      </h5>

      <div className="mt-2 grid grid-cols-5 gap-4">

        {CAMERA_IDS.map((camId) => {
          const camData = allRecords.find((r) => r.Cam_ID === camId);
          return (
            <div
              key={camId}
              onClick={() => router.push(`/camera?id=${camId}&location=${selectedLocation}`)}
              className="cursor-pointer rounded-lg border border-stroke bg-white py-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark dark:hover:border-white transition"
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
    </>
  );
};

export default CameraGrid;
