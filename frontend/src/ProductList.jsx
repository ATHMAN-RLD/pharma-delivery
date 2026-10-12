import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon asset paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mombasa Coordinates & Delivery Hubs
const MOMBASA_CENTER = [-4.0435, 39.6682];

const DELIVERY_LOCATIONS = [
  { name: 'Nyali', lat: -4.032, lng: 39.7041, fee: 150, time: '20-30 mins' },
  { name: 'Bamburi', lat: -3.98, lng: 39.715, fee: 200, time: '30-40 mins' },
  { name: 'Tudor', lat: -4.04, lng: 39.658, fee: 150, time: '20-30 mins' },
  { name: 'Changamwe', lat: -4.025, lng: 39.622, fee: 250, time: '35-45 mins' },
  { name: 'Kisauni', lat: -4.01, lng: 39.685, fee: 200, time: '30-40 mins' },
  { name: 'Likoni', lat: -4.08, lng: 39.665, fee: 300, time: '40-50 mins' },
];

function ProductList({ onOrderOnline }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(DELIVERY_LOCATIONS[0]);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    fetch('http://localhost/pharma-api/get_products.php')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category || 'General'))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppWithDelivery = (productName, price) => {
    const message = `Hello PharmaExpress! I would like to order *${productName}* (KES ${price}). Delivery location: *${selectedLocation.name}* (Fee: KES ${selectedLocation.fee}, Est: ${selectedLocation.time}). Total: KES ${price + selectedLocation.fee}`;
    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div>
      {/* Interactive Delivery Map Header */}
      <div style={styles.deliveryBanner}>
        <div style={styles.bannerHeader}>
          <div>
            <div style={styles.deliveryBadge}>🚀 MOMBASA LIVE DELIVERY MAP</div>
            <h2 style={styles.bannerTitle}>24/7 Doorstep Pharmaceutical Delivery</h2>
            <p style={styles.bannerSubtitle}>
              Select your zone on the map below to check delivery fees and coverage time.
            </p>
          </div>
          <button style={styles.toggleMapBtn} onClick={() => setShowMap(!showMap)}>
            {showMap ? '🗺️ Hide Delivery Map' : '🗺️ Show Delivery Map'}
          </button>
        </div>

        {/* Live Leaflet Map Container */}
        {showMap && (
          <div style={styles.mapContainer}>
            <MapContainer
              center={MOMBASA_CENTER}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: '280px', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Delivery Hub Radius Circle */}
              <Circle
                center={MOMBASA_CENTER}
                radius={12000}
                pathOptions={{ color: '#0284c7', fillColor: '#0284c7', fillOpacity: 0.15 }}
              />

              {/* Location Markers */}
              {DELIVERY_LOCATIONS.map((loc) => (
                <Marker
                  key={loc.name}
                  position={[loc.lat, loc.lng]}
                  eventHandlers={{
                    click: () => setSelectedLocation(loc),
                  }}
                >
                  <Popup>
                    <div style={{ color: '#0f172a' }}>
                      <strong>📍 {loc.name}</strong>
                      <br />
                      Fee: KES {loc.fee}
                      <br />
                      ETA: {loc.time}
                      <br />
                      <button
                        onClick={() => setSelectedLocation(loc)}
                        style={styles.popupSelectBtn}
                      >
                        Select Location
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Selected Zone Bar */}
        <div style={styles.selectedZoneBar}>
          <div>
            📍 Active Destination: <strong>{selectedLocation.name}</strong>
          </div>
          <div>🚚 Fee: <strong>KES {selectedLocation.fee}</strong></div>
          <div>⏱️ Est. Time: <strong>{selectedLocation.time}</strong></div>
        </div>
      </div>

      {/* Search and Categories */}
      <div style={styles.controlsRow}>
        <div style={styles.categoryBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={selectedCategory === cat ? styles.activeCategoryBtn : styles.categoryBtn}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="🔍 Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>


      {/* Products Grid */}
<div style={styles.grid}>
  {filteredProducts.map((product) => (
    <div key={product.id} style={styles.card}>
      <div>
        {/* Product Image */}
        <div style={styles.imageWrapper}>
          <img
            src={product.image_url}
            alt={product.name}
            style={styles.productImage}
            onError={(e) => {
              // Fallback image if file is missing
              e.target.src = 'https://via.placeholder.com/300x180/1e293b/38bdf8?text=PharmaExpress';
            }}
          />
        </div>

        <div style={styles.cardHeader}>
          <span style={styles.badge}>{product.category || 'Medicine'}</span>
          <span style={styles.stockText}>
            {product.stock_quantity ? `${product.stock_quantity} in stock` : 'In Stock'}
          </span>
        </div>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <p style={styles.cardDesc}>{product.description}</p>
      </div>

      <div>
        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Price:</span>
          <span style={styles.price}>KES {Number(product.price).toLocaleString()}</span>
        </div>
        <div style={styles.btnGroup}>
          <button
            style={styles.payBtn}
            onClick={() => onOrderOnline({ ...product, deliveryLocation: selectedLocation })}
          >
            💳 Pay Online
          </button>
          <button
            style={styles.waBtn}
            onClick={() => handleWhatsAppWithDelivery(product.name, product.price)}
          >
            📱 WhatsApp
          </button>
        </div>
      </div>
    </div>
  ))}
</div> 

      {/* Product List */}
      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.card}>
            <div>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{product.category || 'Medicine'}</span>
                <span style={styles.stockText}>
                  {product.stock_quantity ? `${product.stock_quantity} in stock` : 'In Stock'}
                </span>
              </div>
              <h3 style={styles.cardTitle}>{product.name}</h3>
              <p style={styles.cardDesc}>{product.description}</p>
            </div>

            <div>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Price:</span>
                <span style={styles.price}>KES {Number(product.price).toLocaleString()}</span>
              </div>
              <div style={styles.btnGroup}>
                <button
                  style={styles.payBtn}
                  onClick={() => onOrderOnline({ ...product, deliveryLocation: selectedLocation })}
                >
                  💳 Pay Online
                </button>
                <button
                  style={styles.waBtn}
                  onClick={() => handleWhatsAppWithDelivery(product.name, product.price)}
                >
                  📱 WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  imageWrapper: {
    width: '100%',
    height: '160px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    marginBottom: '14px',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  deliveryBanner: {
    backgroundColor: '#1e293b',
    border: '1px solid #0284c7',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '28px',
  },
  bannerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' },
  deliveryBadge: { display: 'inline-block', backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', marginBottom: '8px' },
  bannerTitle: { margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800', color: '#f8fafc' },
  bannerSubtitle: { margin: '0 0 16px 0', color: '#94a3b8', fontSize: '13px' },
  toggleMapBtn: { backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #0284c7', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' },
  mapContainer: { marginBottom: '16px', border: '2px solid #334155', borderRadius: '14px', overflow: 'hidden' },
  selectedZoneBar: { display: 'flex', gap: '20px', backgroundColor: '#0f172a', padding: '12px 18px', borderRadius: '10px', color: '#38bdf8', fontSize: '13px', border: '1px solid #334155', flexWrap: 'wrap' },
  popupSelectBtn: { marginTop: '6px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  controlsRow: { display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  categoryBar: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  categoryBtn: { backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
  activeCategoryBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' },
  searchInput: { padding: '10px 16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', minWidth: '240px', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1e293b', borderRadius: '14px', padding: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  badge: { backgroundColor: '#0284c7', color: '#e0f2fe', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' },
  stockText: { color: '#10b981', fontSize: '11px', fontWeight: '600' },
  cardTitle: { margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#ffffff' },
  cardDesc: { color: '#94a3b8', fontSize: '12px', marginBottom: '16px', lineHeight: '1.4' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  priceLabel: { color: '#94a3b8', fontSize: '12px' },
  price: { fontSize: '18px', fontWeight: '800', color: '#38bdf8' },
  btnGroup: { display: 'flex', gap: '10px' },
  payBtn: { flex: 1, backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' },
  waBtn: { flex: 1, backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #10b981', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' },
};

export default ProductList; 