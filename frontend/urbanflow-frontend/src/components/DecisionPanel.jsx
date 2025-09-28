import React from "react";

export default function DecisionPanel({ decisions }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Dernières décisions</h2>
      {decisions.length === 0 ? (
        <p className="text-gray-500">Aucune décision disponible.</p>
      ) : (
        <ul className="space-y-3">
          {decisions.map((d, idx) => (
            <li
              key={idx}
              className="bg-white shadow rounded-md p-3 border hover:bg-gray-50 transition"
            >
              <p>
                <span className="font-bold">Capteur:</span> {d.sensor_id}
              </p>
              <p>
                <span className="font-bold">Décision:</span> {d.decision}
              </p>
              {d.set_green_duration_s !== undefined && d.set_green_duration_s !== null && (
                <p>
                  <span className="font-bold">Feu vert:</span> {d.set_green_duration_s}s
                </p>
              )}
              {d.reason && (
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Raison:</span> {d.reason}
                </p>
              )}
              <p className="text-xs text-gray-500">{d.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
      {/* Action button */}
      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        ✅ Appliquer les décisions
      </button>
    </div>
  );
}
