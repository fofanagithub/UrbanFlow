import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";
import DecisionPanel from "./components/DecisionPanel";
import axios from "axios";

export default function App() {
  const [decisions, setDecisions] = useState([]);

  // Poll backend for decisions every 5s
  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/decisions");
        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
            ? res.data.items
            : [];
        setDecisions(payload);
      } catch (err) {
        console.error("Failed to fetch decisions", err);
      }
    };

    fetchDecisions();
    const interval = setInterval(fetchDecisions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">🚦 UrbanFlow Dashboard</h1>
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1">
          <MapView decisions={decisions} />
        </div>

        {/* Right panel */}
        <aside className="w-80 bg-gray-100 border-l overflow-y-auto">
          <DecisionPanel decisions={decisions} />
        </aside>
      </main>
    </div>
  );
}
