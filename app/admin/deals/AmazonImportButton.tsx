"use client";

import { useState } from "react";

export function AmazonImportButton() {
  const [asin, setAsin] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    if (!asin.trim()) {
      setMessage("Please enter an ASIN");
      return;
    }

    setIsImporting(true);
    setMessage("Importing from Amazon...");

    try {
      const response = await fetch("/api/admin/deals/amazon-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ asin: asin.trim(), notify: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Success! Deal created and sent to Telegram`);
        setAsin("");
      } else {
        setMessage(`Error: ${data.error || "Failed to import"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
      <div className="flex items-center gap-2">
        <span className="text-xl">🛒</span>
        <h3 className="font-semibold text-gray-900">Import from Amazon</h3>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
          placeholder="Enter ASIN (e.g. B08N5WRWNW)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isImporting}
        />
        <button
          onClick={handleImport}
          disabled={isImporting || !asin.trim()}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isImporting ? "Importing..." : "Import"}
        </button>
      </div>
      
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
