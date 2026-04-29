import React, { ReactNode } from 'react';

import GaugeChart from 'react-gauge-chart';

interface OccupancyIndicatorProps {
  low: string;
  high: string;
  tf: string;
  sf: string;
  people: string
}


const OccupancyIndicator: React.FC<OccupancyIndicatorProps> = ({ low, high, tf, sf, people }) => {
  
  console.log(low);

  return (
    
    <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
     <h5 className="text-title-md font-bold text-black dark:text-white">
           Occupancy Indicator
          </h5>
    <div className="flex items-center justify-center rounded-full">
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>Low   : 0</div>
      <div style={{ marginRight: '20px' }}>25%   : {tf}</div>
      <div style={{ marginRight: '20px' }}>75%   : {sf}</div>
      <div>High  : {high}</div>
    </div>
      {/* <GaugeChart
        id="gauge-chart1"
        percent={numericPercent}
        arcPadding={0}
        textColor={'#555'}
        needleBaseColor="#464A4F"
        formatTextValue={(value) => `${numericPercent *numericPercent/ 100 }%`}
        animate={false}
      /> */}
      </div>
    </div>
  );
};

export default OccupancyIndicator;
