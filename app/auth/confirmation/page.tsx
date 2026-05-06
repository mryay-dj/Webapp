"use client";

import { useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  console.log("EMAIL FROM URL:", email);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Confirm Account</h2>

      <p className="mb-2">Email: {email}</p>

      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Enter confirmation code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Confirming..." : "Confirm Account"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}