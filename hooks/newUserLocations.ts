import { useState, useEffect } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

// Full list of every location that exists in the system
const ALL_LOCATIONS = [
  "7th Street Market",
  "ABC Store",
  "CPCC",
  "TeCSAR Lab",
  "Parking lot",
  "VAPA-Center",
  "Bianco-Tower",
  "CPCC_Merancas",
  "CPCC_Centrale",
];

const useUserLocations = () => {
  const [allowedLocations, setAllowedLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const raw = attributes["custom:locations"];

        if (raw === "all") {
          setAllowedLocations(ALL_LOCATIONS);
        } else if (raw) {
          setAllowedLocations(raw.split(","));
        } else {
          setAllowedLocations([]); // no access if attribute missing
        }
      } catch (err) {
        console.error("Failed to load user locations:", err);
        setAllowedLocations([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { allowedLocations, loading };
};

export default useUserLocations;