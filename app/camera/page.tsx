"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChartFour from "@/components/Charts/ChartFour";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import OccupancyIndicator from "@/components/Charts/OccupancyIndicator";
import React, { useState, useEffect } from "react";
import getData from "../../hooks/getData";
import Anomalies from "@/components/UIElements/Anamolies";
import { URL } from "../../hooks/config";
import CardDataStats from "@/components/CardDataStats";
import Dropdown from "@/components/UIElements/Dropdown";
const BirdEyeView = dynamic(
  () => import("@/components/Charts/BirdEyeView"),
  { ssr: false }
);
import dynamic from "next/dynamic";

const Heatmap = dynamic(
  () => import("@/components/UIElements/Heatmap"),
  { ssr: false }
);

const options = ["CPCC", "TeCSAR Lab", "Parking lot"];
const cams = ["Camera 1", "Camera 2", "Camera 3", "Camera 4"];

interface Item {
  Anomalies: string[];
  Anomaly_Count: string;
  id: number;
  Recorded_Time: string;
  Active_Cams: number;
  Cam_ID: string;
  People_Count: string;
  High: number;
  Low: number;
  Status: string;
  Seven_Five: number;
  Updated_Time: string;
  Two_Five: number;
  Location: string;
  X_Coordinates: number[];
  Y_Coordinates: number[];
}

const Camera = () => {
  const [selectedCamera, setSelectedCamera] = useState("Camera 1");
  const [selectedLocation, setSelectedLocation] = useState("CPCC");

  const [latestRecord, setLatestRecord] = useState<Item | null>(null);

  const fetchData = async () => {
    try {
      const { latestRecord } = await getData(URL, selectedCamera);
      setLatestRecord(latestRecord);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedCamera, selectedLocation]);

  const getCurrentTimestamp = () =>
    new Date().toISOString().replace("T", " ").split(".")[0];

  const cards = [
    { imageUrl: "/images/Anomalies/gun.png", count: 0, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/massgathering.png", count: 0, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/run.png", count: 0, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/bag.png", count: 0, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/literring.png", count: 0, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/slip.png", count: 0, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/grunning.png", count: 1, title: "mass gathering" },
    { imageUrl: "/images/Anomalies/fight.png", count: 0, title: "mass gathering" },
  ];

  return (
    <>
      <Breadcrumb pageName="Camera" />

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <Dropdown options={options} title="Location" onChange={setSelectedLocation} />
        <Dropdown options={cams} title="Camera" onChange={setSelectedCamera} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <CardDataStats
          title="People"
          total={latestRecord?.People_Count || "0"}
          rate={`${latestRecord?.Updated_Time || getCurrentTimestamp()} EST`}
        >
          <svg />
        </CardDataStats>

        <OccupancyIndicator
          low={`${latestRecord?.Low || "0"}`}
          high={`${latestRecord?.High || "10"}`}
          tf={`${latestRecord?.Two_Five || "0"}`}
          sf={`${latestRecord?.Seven_Five || "0"}`}
          people={`${latestRecord?.People_Count || "0"}`}
        />

        <CardDataStats
          title="Anomalies"
          total={latestRecord?.Anomaly_Count || "0"}
          rate="2.21%"
          levelDown
        >
          <svg />
        </CardDataStats>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        <div className="col-span-12">
          <ChartFour />
        </div>

        {/* ✅ Heatmap CLEAN */}
        <Heatmap
          xValues={latestRecord?.X_Coordinates}
          yValues={latestRecord?.Y_Coordinates}
        />

        <BirdEyeView
          x={latestRecord?.X_Coordinates ??[]}
          y={latestRecord?.Y_Coordinates ??[]}
        />

        <ChartTwo />
        <Anomalies cards={cards} />
        <ChartOne />
        <ChartThree />
      </div>
    </>
  );
};

export default Camera;