"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import TableOne from "@/components/Tables/TableOne";
import VideoList from "@/components/UIElements/VideoList";
import Dropdown from "@/components/UIElements/Dropdown";
import { Metadata } from "next";
import Checkbox from "@/components/Checkboxes/Checkbox";
export const metadata: Metadata = {
  title: "AI powered Safe Community App",
  description: "AI powered application to improve safety in communities and Universities.",
  // other metadata
};

const options = ['CPCC', 'TeCSAR Lab', 'Parking lot'];
const recordSpan = ['All', 'Today', 'This week', 'This month', 'Camera 1', 'Camera 2', 'Camera 3', 'Camera 4'] // video recording options for different time periods and cameras
const sampleData = [
  {
    videoUrl: 'path/to/video1.mp4',
    title: 'Anomaly identified at CPCC on 8 Jan 2024 10:30 AM',
    description: 'A bag left behind anomaly has been identified at this location',
    timestamp: '00:05:32',
  },
  {
    videoUrl: 'path/to/video2.mp4',
    title: 'Anomaly identified at CPCC on 8 Jan 2024 11:00 AM',
    description: 'A Mass gathering anomaly has been identified at this location',
    timestamp: '00:10:15',
  },

  // Add more sample items as needed
];

const events = () => {
  return (
    <>      
      <Breadcrumb pageName="Events" />
      <div className="mx-auto max-w-270">
      <div className="grid grid-cols-1 items-center justify-center">
  <Dropdown options={options} title="Location" onChange= {() => {}}/>

    <h1>Camera Recordings</h1>
      

</div>
    <br>
    </br>
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Events Recorded
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                <div>
                <label className="mb-3 block text-black dark:text-white">
                  Select  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >

                      <div className="flex flex-col gap-5.5 p-6.5">
           
                     <VideoList items={sampleData} />
                     </div>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                         
                        </svg>
                      </span>
                   
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      <div className="flex flex-col-2 gap-5.5 p-6.5">
          
           
            
            </div>
                    </label>
                 
                  </div>
                  <div className="flex  gap-4.5 justify-center">
                  
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default events;
