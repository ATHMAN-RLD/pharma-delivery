import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon paths
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DeliveryMap() {
  // Mombasa coordinates: Central Hub to Nyali
  const pharmacyLocation = [-4.0547, 39.6738]; 
  const customerLocation = [-4.0321, 39.6922]; 

  const routeCoordinates = [
    pharmacyLocation,
    [-4.0450, 39.6800],
    [-4.0380, 39.6860],
    customerLocation,
  ];

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📍 Real-Time Delivery Tracking (Mombasa)</h3>
      <p style={styles.subheading}>
        Tracking order route from <strong>Mombasa Central Pharmacy Hub</strong> to <strong>Nyali Zone</strong>.
      </p>

      <div style={styles.mapContainer}>
        <MapContainer center={[-4.0434, 39.6830]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={pharmacyLocation} icon={customIcon}>
            <Popup>
              🏥 <strong>Mombasa Central Pharmacy</strong><br />Order Dispatch Location
            </Popup>
          </Marker>

          <Marker position={customerLocation} icon={customIcon}>
            <Popup>
              🏠 <strong>Delivery Destination</strong><br />Nyali, Mombasa
            </Popup>
          </Marker>

          <Polyline positions={routeCoordinates} color="#0284c7" weight={4} dashArray="5, 10" />
        </MapContainer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: '30px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  heading: {
    color: '#0f172a',
    margin: '0 0 10px 0',
  },
  subheading: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '15px',
  },
  mapContainer: {
    height: '350px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
};

export default DeliveryMap;  