import { fetchSports } from "@/lib/supabase";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

interface ImportResult {
  total: number;
  success: number;
  errors: Array<{
    type: string;
    sport?: string;
    batch?: number;
    error: string;
    sportDetails?: {
      length: number;
      chars: number[];
      availableSports: string[];
    };
  }>;
  debug?: {
    existingSports: Array<{
      name: string;
      id: string;
      nameLength: number;
      nameChars: number[];
    }>;
    uniqueSportsInCsv: Array<{
      name: string;
      length: number;
      chars: number[];
    }>;
    sportMapEntries: Array<{
      name: string;
      id: string;
    }>;
  };
}

interface ImportAthletesProps {
  onImportComplete: () => void;
}

export default function ImportAthletes({
  onImportComplete,
}: ImportAthletesProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sports = await fetchSports();
      console.log("Available sports:", sports);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sports", JSON.stringify(sports));

      console.log("Sending request to import athletes...");
      const response = await fetch("/api/import-athletes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to import athletes");
      }

      if (data.results?.errors?.length > 0) {
        console.log("Import errors:", data.results.errors);
      }

      setResult(data.results);
      onImportComplete(); // Trigger parent refresh
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => document.getElementById("csvFile")?.click()}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue"
        disabled={loading}
      >
        <FiUpload className="-ml-1 mr-2 h-5 w-5" />
        Import Athletes
      </button>

      <form onSubmit={handleSubmit} className="hidden">
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </form>

      {/* Modal for showing import status */}
      {(file || loading || result || error) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Import Athletes
                </h3>
                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                {file && !result && !error && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Selected file: {file.name}
                    </p>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full mt-2 px-4 py-2 bg-ncaa-blue text-white rounded-md hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-ncaa-blue focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Importing...
                        </div>
                      ) : (
                        "Start Import"
                      )}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 text-green-700 rounded-md">
                      <h4 className="font-semibold">Import Results</h4>
                      <p>Total records: {result.total}</p>
                      <p>Successfully imported: {result.success}</p>
                    </div>

                    {result.errors.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowDebug(!showDebug)}
                          className="text-sm text-ncaa-blue hover:text-ncaa-darkblue"
                        >
                          {showDebug ? "Hide" : "Show"} Error Details
                        </button>

                        {showDebug && (
                          <div className="mt-2 p-4 bg-red-50 text-red-700 rounded-md text-sm">
                            <h4 className="font-semibold mb-2">Errors:</h4>
                            <ul className="list-disc list-inside space-y-2">
                              {result.errors.map((err, index) => (
                                <li key={index}>
                                  {err.type === "sport_not_found" ? (
                                    <div>
                                      <p>{err.error}</p>
                                      {err.sportDetails && (
                                        <div className="ml-4 mt-1 text-xs">
                                          <p>
                                            Available sports:{" "}
                                            {err.sportDetails.availableSports.join(
                                              ", "
                                            )}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <p>{err.error}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
