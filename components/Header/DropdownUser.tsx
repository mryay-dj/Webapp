"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, getCurrentUser } from "aws-amplify/auth";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();
        const email = user.signInDetails?.loginId || user.username || "";
        setUserEmail(email);
        setUserInitial(email[0]?.toUpperCase() || "U");
      } catch (err) {
        console.log("Not logged in");
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ global: true });
    } catch (err) {
      console.log(err);
    } finally {
      window.location.href = "/auth/signin";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {userEmail || "User"}
          </span>
        </span>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
          {userInitial}
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-1 p-2">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-meta-4 rounded-lg"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-meta-4 rounded-lg"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-meta-4 rounded-lg"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;