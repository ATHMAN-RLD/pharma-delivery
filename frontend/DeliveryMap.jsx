import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon paths in React build environment
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DeliveryMap() {
  // Coordinates in Mombasa: Coast General Teaching Hospital -> Nyali Residential
  const pharmacyLocation = [-4.0547, 39.6738]; // Pharmacy / Hospital Hub
  const customerLocation = [-4.0321, 39.6922]; // Customer Address (Nyali)

  // Delivery Route path line
  const routeCoordinates = [
    pharmacyLocation,
    [-4.0450, 39.6800],
    [-4.0380, 39.6860],
    customerLocation,
  ];

  return (
    <div style={{ marginTop: '30px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>📍 Real-Time Delivery Tracking (Mombasa)</h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
        Tracking order route from <strong>Mombasa Central Pharmacy Hub</strong> to <strong>Nyali Delivery Zone</strong>.
      </p>

      <div style={{ height: '350px', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer center={[-4.0434, 39.6830]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Pharmacy Marker */}
          <Marker position={pharmacyLocation} icon={customIcon}>
            <Popup>
              🏥 <strong>Mombasa Central Pharmacy</strong><br />Order Dispatch Location
            </Popup>
          </Marker>

          {/* Customer Marker */}
          <Marker position={customerLocation} icon={customIcon}>
            <Popup>
              🏠 <strong>Delivery Destination</strong><br />Nyali, Mombasa
            </Popup>
          </Marker>

          {/* Simulated Route Line */}
          <Polyline positions={routeCoordinates} color="#0284c7" weight={4} dashArray="5, 10" />
        </MapContainer>
      </div>
    </div>
  );
}

export default DeliveryMap;  