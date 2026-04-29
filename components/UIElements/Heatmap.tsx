"use client";

import React, { useEffect, useRef } from "react";

interface HeatmapProps {
  xValues?: number[];
  yValues?: number[];
}

const Heatmap: React.FC<HeatmapProps> = ({ xValues = [], yValues = [] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;
    if (!xValues.length || xValues.length !== yValues.length) return;

    const loadHeatmap = async () => {
      const heatmapLib = (await import("heatmap.js")).default;

      // destroy old instance if exists
      if (instanceRef.current) {
        instanceRef.current = null;
      }

      const instance = heatmapLib.create({
        container: containerRef.current!,
        radius: 30,
        maxOpacity: 0.5,
        minOpacity: 0,
        blur: 0.9,
        gradient: {
          ".4": "blue",
          ".6": "cyan",
          ".8": "lime",
          ".95": "yellow",
          "1": "red",
        },
      });

      const data = xValues.map((x, i) => ({
        x,
        y: yValues[i],
        value: 1,
      }));

      instance.setData({
        max: 5,
        min: 0,
        data,
      });

      instanceRef.current = instance;
    };

    loadHeatmap();
  }, [xValues, yValues]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h5 className="text-xl font-semibold text-black dark:text-white mb-3">
        Heat Map
      </h5>

      <div
        ref={containerRef}
        style={{ width: "100%", height: "350px", overflow: "hidden" }}
      />
    </div>
  );
};

export default Heatmap;