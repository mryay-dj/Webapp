// Maps access codes to which locations they unlock
// "all" means every location
export const ACCESS_CODE_MAP: Record<string, string[] | "all"> = {
  "SAFEC-ADMIN-2026": "all",
  "SAFEC-7TH-ONLY": ["7th Street Market"],
  "SAFEC-CPCC-ONLY": ["CPCC", "CPCC_Merancas", "CPCC_Centrale"],
  "SAFEC-MULTI-01": ["7th Street Market", "ABC Store"],
  "SAFEC-VAPA-ONLY": ["VAPA-Center"],
  "SAFEC-BIANCO-ONLY": ["Bianco-Tower"],
};

// Validates a code and returns the locations it unlocks, or null if invalid
export const validateAccessCode = (code: string): string[] | "all" | null => {
  const trimmed = code.trim().toUpperCase();
  return ACCESS_CODE_MAP[trimmed] ?? null;
};