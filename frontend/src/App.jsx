import { useEffect, useState } from 'react';
import DeliveryMap from './DeliveryMap';
import CheckoutModal from './CheckoutModal';
import OrderDashboard from './OrderDashboard';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'dashboard'

  // Curated fallback image gallery for medical inventory
  const fallbackImages = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550572017-edd951baa74c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80',
  ];

  useEffect(() => {
    fetch('http://localhost/pharma-api/get_products.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const handleOrderSuccess = (orderId, productName) => {
    setCartCount((prev) => prev + 1);
    setSelectedProduct(null);
    setSuccessNotice(`Order #${orderId} for "${productName}" placed successfully!`);
    setTimeout(() => setSuccessNotice(''), 6000);
  };

  return (
    <div style={styles.container}>
      {/* Dynamic Full-Width Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoBadge}>
            <span style={styles.logoIcon}>✚</span>
          </div>
          <div>
            <h1 style={styles.brandTitle}>PharmaExpress</h1>
            <p style={styles.brandSubtitle}>Mombasa 24/7 Rapid Healthcare & Logistics</p>
          </div>
        </div>

        {/* Tab Switcher & Order Counter */}
        <div style={styles.navActions}>
          <button
            onClick={() => setActiveTab('shop')}
            style={activeTab === 'shop' ? styles.navTabActive : styles.navTab}
          >
            🏪 Medicine Store
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={activeTab === 'dashboard' ? styles.navTabActive : styles.navTab}
          >
            📊 Orders Dashboard
          </button>

          <div style={styles.cartBadge}>
            <span>🛒 Basket</span>
            <span style={styles.cartCount}>{cartCount}</span>
          </div>
        </div>
      </header>

      {/* Hero Banner with Geometric Pattern */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroTag}>🚀 Express Delivery Across Mombasa Zone</span>
          <h2 style={styles.heroTitle}>Quality Pharmaceuticals & Medical Supplies Delivered Fast</h2>
          <p style={styles.heroSub}>
            Order genuine prescription medicines, first aid kits, and supplements verified by central Mombasa pharmacy hubs.
          </p>
        </div>
      </section>

      {/* Full Width Main Layout Area */}
      <main style={styles.mainFullWidth}>
        {successNotice && <div style={styles.alert}>🎉 {successNotice}</div>}

        {activeTab === 'dashboard' ? (
          <OrderDashboard />
        ) : (
          <>
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Featured Medicines & Supplies</h3>
                <p style={styles.sectionSubtitle}>Verified items in stock for immediate dispatch</p>
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingBox}>
                <p style={styles.loadingText}>Loading healthcare catalog...</p>
              </div>
            ) : (
              <div style={styles.fullGrid}>
                {products.map((item, idx) => {
                  const imgUrl = item.image_url || fallbackImages[idx % fallbackImages.length];
                  return (
                    <div key={item.id} style={styles.card}>
                      <div style={styles.imageContainer}>
                        <img src={imgUrl} alt={item.name} style={styles.image} />
                        <span style={styles.rxBadge}>Verified Stock</span>
                      </div>
                      <div style={styles.cardBody}>
                        <h4 style={styles.productName}>{item.name}</h4>
                        <p style={styles.productDesc}>{item.description}</p>
                        <div style={styles.priceRow}>
                          <div>
                            <span style={styles.priceLabel}>Price</span>
                            <div style={styles.price}>KES {Number(item.price).toLocaleString()}</div>
                          </div>
                          <span style={styles.stock}>● {item.stock_quantity} available</span>
                        </div>
                        <button onClick={() => setSelectedProduct(item)} style={styles.addButton}>
                          Add to Order
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Live GPS Delivery Map */}
            <DeliveryMap />
          </>
        )}
      </main>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#f1f5f9',
    backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)`,
    backgroundSize: '30px 30px, 100% 100%',
    minHeight: '100vh',
    margin: 0,
    paddingBottom: '60px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    borderBottom: '4px solid #0284c7',
    flexWrap: 'wrap',
    gap: '16px',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
  },
  logoIcon: { fontSize: '26px', color: '#ffffff', fontWeight: 'bold' },
  brandTitle: { margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' },
  brandSubtitle: { margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
  navActions: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  navTab: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid #334155',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
  },
  navTabActive: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: '1px solid #0284c7',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
  },
  cartBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    border: '1px solid #334155',
  },
  cartCount: {
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  hero: {
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #0f172a 100%)',
    color: '#ffffff',
    padding: '50px 40px',
    textAlign: 'center',
    boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)',
  },
  heroContent: { maxWidth: '900px', margin: '0 auto' },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#38bdf8',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    display: 'inline-block',
    marginBottom: '14px',
  },
  heroTitle: { fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0' },
  heroSub: { fontSize: '16px', color: '#e0f2fe', margin: 0, opacity: 0.9 },
  mainFullWidth: {
    width: '94%',
    maxWidth: '1600px',
    margin: '35px auto 0 auto',
  },
  alert: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    border: '1px solid #86efac',
    padding: '14px 20px',
    borderRadius: '10px',
    marginBottom: '24px',
    fontWeight: '600',
  },
  sectionHeader: { marginBottom: '20px' },
  sectionTitle: { color: '#0f172a', fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0' },
  sectionSubtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  loadingBox: { textAlign: 'center', padding: '40px 0' },
  loadingText: { color: '#64748b', fontWeight: '500' },
  fullGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid #cbd5e1',
  },
  imageContainer: { height: '200px', overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  rxBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    color: '#38bdf8',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  productName: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' },
  productDesc: { fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', flexGrow: 1, lineHeight: '1.4' },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  priceLabel: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  price: { fontSize: '18px', fontWeight: '800', color: '#0284c7' },
  stock: { fontSize: '12px', color: '#10b981', fontWeight: '600' },
  addButton: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
  },
};

export default App; 