import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DeliveryMap() {
  const pharmacyLocation = [-4.0547, 39.6738]; 
  const customerLocation = [-4.0321, 39.6922]; 

  const [riderLocation, setRiderLocation] = useState(pharmacyLocation);
  const [deliveryMeta, setDeliveryMeta] = useState({
    status: 'In Transit',
    progress: 0,
    eta: 15,
  });

  useEffect(() => {
    const fetchRiderPosition = async () => {
      try {
        const res = await fetch('http://localhost/pharma-api/get_delivery_status.php');
        const data = await res.json();

        if (data.status === 'success') {
          setRiderLocation([data.current_location.lat, data.current_location.lng]);
          setDeliveryMeta({
            status: data.delivery_status,
            progress: data.progress_percentage,
            eta: data.eta_minutes,
          });
        }
      } catch (err) {
        console.error('Error fetching dynamic GPS status:', err);
      }
    };

    // Initial fetch
    fetchRiderPosition();

    // Poll endpoint every 3 seconds for dynamic coordinates
    const interval = setInterval(fetchRiderPosition, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <div>
          <h3 style={styles.heading}>📍 Real-Time Live Delivery Tracking</h3>
          <p style={styles.subheading}>Mombasa Central Pharmacy Hub ➔ Nyali Zone</p>
        </div>
        <div style={styles.badgeGroup}>
          <span style={styles.statusBadge}>Status: {deliveryMeta.status}</span>
          <span style={styles.etaBadge}>ETA: ~{deliveryMeta.eta} mins</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBg}>
        <div style={{ ...styles.progressBar, width: `${deliveryMeta.progress}%` }} />
      </div>

      <div style={styles.mapContainer}>
        <MapContainer center={[-4.0434, 39.6830]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fixed Pharmacy Origin */}
          <Marker position={pharmacyLocation} icon={customIcon}>
            <Popup>🏥 <strong>Mombasa Central Pharmacy</strong></Popup>
          </Marker>

          {/* Dynamic Rider Marker */}
          <Marker position={riderLocation} icon={customIcon}>
            <Popup>
              🛵 <strong>Delivery Rider in Motion</strong><br />
              Progress: {deliveryMeta.progress}%
            </Popup>
          </Marker>

          {/* Fixed Customer Destination */}
          <Marker position={customerLocation} icon={customIcon}>
            <Popup>🏠 <strong>Customer Delivery Address</strong></Popup>
          </Marker>

          <Polyline
            positions={[pharmacyLocation, riderLocation, customerLocation]}
            color="#0284c7"
            weight={4}
            dashArray="6, 8"
          />
        </MapContainer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: '30px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  heading: { color: '#0f172a', margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700' },
  subheading: { color: '#64748b', fontSize: '13px', margin: 0 },
  badgeGroup: { display: 'flex', gap: '8px' },
  statusBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  etaBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  progressBg: {
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0284c7',
    transition: 'width 0.5s ease-in-out',
  },
  mapContainer: {
    height: '360px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #cbd5e1',
  },
};

export default DeliveryMap;  