"use client";
import { useState } from 'react';

interface CheckboxProps {
  label: string;
}

const Checkbox = ({ label }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div>
      <label
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={label}
            checked={isChecked}
            className="sr-only"
            onChange={toggleCheckbox}
          />
          <div
            className={`box mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && 'border-primary bg-gray dark:bg-transparent'
            }`}
          >
            <span
              className={`text-primary opacity-0 ${
                isChecked && '!opacity-100'
              }`}
            >
              <svg
                className="h-3.5 w-3.5 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        {label} {/* Use the passed label prop here */}
      </label>
    </div>
  );
};

export default Checkbox;
