"use client";
import React, { useEffect } from 'react';
import heatmap from 'heatmap.js';

const Heatmap: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById('heatmapContainer');
    const initialData = [
      { x: 50, y: 50, value: 20 },
      // Initial data points
    ];

    if (container) {
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

      let currentData = [...initialData];

      heatmapInstance.setData({
        max: 15, // Adjust based on your data's maximum value
        min: 0, // Adjust based on your data's minimum value
        data: currentData,
      });

      // Function to add a new random data point
      const addNewValue = () => {
        const newDataPoint = {
          x: Math.random() * 1000, // Random x coordinate (0-1000)
          y: Math.random() * 1000, // Random y coordinate (0-1000)
          value: Math.floor(Math.random() * 15) + 1, // Random value between 1 and 15
        };

        currentData.push(newDataPoint);
        heatmapInstance.setData({
          max: 15,
          min: 0,
          data: currentData,
        });
      };

      // Add a new value every 5 seconds
      const intervalId = setInterval(() => {
        addNewValue();
      }, 5000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Heat Map</h5>
        </div>
        <div></div>
      </div>

      <div id="heatmapContainer" style={{ width: '100%', height: '350px', border: '1px solid #000' }} />
    </div>
  );
};

export default Heatmap;
