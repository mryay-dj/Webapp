import React, { useState } from 'react';
import heatmap from 'heatmap.js';

interface HeatmapProps {
  xValues?: number[];
  yValues?: number[];
}

const Heatmap: React.FC<HeatmapProps> = ({ xValues = [], yValues = [] }) => {
  const [currentData, setCurrentData] = useState<Array<{ x: number; y: number; value: number }>>([]);

  const container = document.getElementById('heatmapContainer');

  if (container && xValues && yValues && xValues.length === yValues.length) {
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

    const newData = xValues.map((x, index) => ({
      x,
      y: yValues[index] || 0,
      value: Math.floor(Math.random() * 15) + 1, // You can adjust the value based on your data
    }));

    setCurrentData(newData);

    heatmapInstance.setData({
      max: 15, 
      min: 0,
      data: newData,
    });
    
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div>
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Heat Map</h5>
        </div>
      </div>
      <div id="heatmapContainer" style={{ width: '100%', height: '350px', border: '1px solid #000', overflow: 'hidden' }} />
    </div>
  );
};

export default Heatmap;
