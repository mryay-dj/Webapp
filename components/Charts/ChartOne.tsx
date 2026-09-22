"use client";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import getTimeSeriesData, { TimeSeriesItem } from "../../hooks/getTimeSeriesData";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartOneProps {
  location: string;
}

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

// Formats a Date as "MM.DD.YYYY" to match the existing UI style
function formatDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}.${dd}.${yyyy}`;
}

// Buckets items into 24 hourly slots (0-23) and sums People_Count per hour,
// across all cameras at the location.
function aggregateByHour(items: TimeSeriesItem[]): number[] {
  const buckets = new Array(24).fill(0);
  items.forEach((item) => {
    const hour = parseInt(item.Hour ?? "-1", 10);
    if (hour >= 0 && hour < 24) {
      buckets[hour] += parseInt(item.People_Count ?? "0", 10);
    }
  });
  return buckets;
}

const ChartOne: React.FC<ChartOneProps> = ({ location }) => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      { name: "48 hours", data: new Array(24).fill(0) },
      { name: "24 hours", data: new Array(24).fill(0) },
    ],
  });
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 3600000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 3600000);

  const fetchChartData = async () => {
    console.log("fetchChartData called, location =", location);
    if (!location) return;
    setLoading(true);
    try {
      // Pull the full 48hr window once; derive the 24hr series as a subset
      const items48 = await getTimeSeriesData(location, 48);

      console.log(items48[0])

      const cutoff24 = Date.now() - 24 * 3600000;
      const items24 = items48.filter(
        (item) => item.Updated_Time && new Date(item.Updated_Time).getTime() >= cutoff24
      );

      

      setState({
        series: [
          { name: "48 hours", data: aggregateByHour(items48) },
          { name: "24 hours", data: aggregateByHour(items24) },
        ],
      });
    } catch (err) {
      console.error("ChartOne fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [location]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: Array.from({ length: 24 }, (_, i) => String(i)),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
  };

  const isWindowAvailable = () => typeof window !== "undefined";
  if (!isWindowAvailable()) return <></>;

  

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Last 48 Hrs</p>
              <p className="text-sm font-medium">{formatDate(twoDaysAgo)} - {formatDate(now)}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Last 24 hrs</p>
              <p className="text-sm font-medium">{formatDate(yesterday)} - {formatDate(now)}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="text-xs text-gray-400 mt-2">Refreshing...</p>}

      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;