"use client";

import { useState } from "react";

export function CuelinksImportButton() {
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    setIsImporting(true);
    setMessage("Importing all campaigns from Cuelinks...");
    try {
      const response = await fetch("/api/admin/cuelinks/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignIds: [] }), // Empty array will fetch all campaigns
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Import complete: ${data.message}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleImport}
        disabled={isImporting}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isImporting ? "Importing..." : "Import from Cuelinks"}
      </button>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}
