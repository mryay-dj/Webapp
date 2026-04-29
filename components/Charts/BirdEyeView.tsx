"use client";
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface BirdEyeViewProps {
  x: number[] | undefined;
  y: number[] |undefined;
}

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'scatter',
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 0,
      options: {
        chart: {
          width: '100%',
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: '100%', // Adjust the width for smaller screens
        },
        xaxis: {
          labels: {
            show: false, // Hide x-axis labels for smaller screens
          },
        },
        yaxis: {
          labels: {
            show: false, // Hide y-axis labels for smaller screens
          },
        },
      },
    },
  ],
  xaxis: {
    type: 'numeric',
    title: {
      text: '',
      style: {
        fontSize: '14px',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      show: true,
      style: {
        fontSize: '12px',
      },
      
    },
    min: 0,
    max: 1280,
    
  },
  yaxis: {
  
    title: {
      text: '',
      style: {
        fontSize: '14px',
      },
    },
    min: 0,
    max: 750,
    labels: {
      show: true,
      style: {
        fontSize: '12px',
      },
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  
  },
};

const BirdEyeView: React.FC<BirdEyeViewProps> = ({ x, y }) => {
  const [state, setState] = useState({
    series: [
      {
        name: '',
        data: x && y ? x.map((val, index) => ({ x: val, y: y[index] })) : [],
      },
    ],
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      series: [
        {
          name: '',
          data: x && y ? x.map((val, index) => ({ x: val, y: y[index] })) : [],
        },
      ],
    }));
  }, [x, y]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
    <div className="mb-4 justify-between gap-4 sm:flex">
      <div>
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Anamolies this week
        </h4>
      </div>
      <div>
      
      </div>
    </div>

    <div>
    <div
          id="BirdEyeView"
          style={{ width: '100%', border: '1px solid #000' }}
        >
          <Chart options={options} series={state.series} type="scatter" width="100%" height="200%" />
        </div>
    </div>
  </div>










  //   <div className="col-span-12 xl:col-span-4 h-full">
  //   <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-full">
  //     <div>
  //       <h5 className="text-xl font-semibold text-black dark:text-white">
  //         Bird's Eye View
  //       </h5>
  //       <br />
  //       <div
  //         id="BirdEyeView"
  //         className="mx-auto flex justify-center h-full"
  //         style={{ width: '100%', border: '1px solid #000' }}
  //       >
  //         <Chart options={options} series={state.series} type="scatter" width="100%" height="100%" />
  //       </div>
  //     </div>
  //   </div>
  // </div>
  
  );
};

export default BirdEyeView;
