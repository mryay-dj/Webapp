import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import { Metadata } from "next";
import Checkbox from "@/components/Checkboxes/Checkbox";
export const metadata: Metadata = {
  title: "AI powered Safe Community App",
  description: "AI powered application to improve safety in communities and Universities.",
  // other metadata
};

const Search = () => {
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Search" />

        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Retrive records of Camera data
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
             

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >

                      <div className="flex flex-col gap-5.5 p-6.5">
           
                     <Checkbox label="Total number of people"></Checkbox>
                     
                     <Checkbox label="Average number of people"></Checkbox>
                     <Checkbox label="Maximum number of people"></Checkbox>
                     <Checkbox label="Most frequent number of people"></Checkbox>
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
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Select Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                Select End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
            
            </div>
                    </label>
                 
                  </div>
                  <div className="flex  gap-4.5 justify-center">
                  
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
                      type="submit"
                    >
                      Get Data
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Results
                </h3>
              </div>
               <TableOne />
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
