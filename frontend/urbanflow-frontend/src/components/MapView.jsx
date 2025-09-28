import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icons on React
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ decisions }) {
  const defaultPosition = [5.3167, -4.0333]; // Exemple: Abidjan

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {decisions.map((d, idx) => (
        <Marker key={idx} position={defaultPosition}>
          <Popup>
            <p className="font-bold">Capteur : {d.sensor_id}</p>
            <p>Décision : {d.decision}</p>
            {d.set_green_duration_s !== undefined && d.set_green_duration_s !== null && (
              <p>Feu vert : {d.set_green_duration_s}s</p>
            )}
            {d.reason && <p className="italic text-xs">{d.reason}</p>}
            <p className="text-xs text-gray-500">{d.timestamp}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
