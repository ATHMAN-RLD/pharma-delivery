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
  const [activeTab, setActiveTab] = useState('shop');

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
      {/* Edge-to-Edge Top Header */}
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

      {/* Hero Banner */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroTag}>⚡ 30-Minute Rapid Delivery</span>
          <h2 style={styles.heroTitle}>Quality Medicines & Supplies Delivered across Mombasa</h2>
          <p style={styles.heroSub}>
            Order genuine pharmaceuticals, vitamins, and healthcare essentials directly from verified pharmacy hubs with instant M-Pesa verification.
          </p>
        </div>
      </section>

      {/* Content Container */}
      <main style={styles.mainContainer}>
        {successNotice && <div style={styles.alert}>🎉 {successNotice}</div>}

        {activeTab === 'dashboard' ? (
          <OrderDashboard />
        ) : (
          <>
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Featured Medicines & Medical Supplies</h3>
                <p style={styles.sectionSubtitle}>Verified items in stock at our central Mombasa pharmacy hub</p>
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingBox}>
                <p style={styles.loadingText}>Loading healthcare inventory...</p>
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

            <DeliveryMap />
          </>
        )}
      </main>
      
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
    backgroundColor: '#0f172a',
    backgroundImage: `
      radial-gradient(circle at 15% 15%, rgba(2, 132, 199, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 40%),
      radial-gradient(#334155 1px, transparent 1px)
    `,
    backgroundSize: '100% 100%, 100% 100%, 28px 28px',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    paddingBottom: '60px',
  },
  navbar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 32px',
    backgroundColor: '#0b1120',
    color: '#ffffff',
    boxShadow: '0 4px 25px rgba(0,0,0,0.4)',
    borderBottom: '2px solid #0284c7',
    boxSizing: 'border-box',
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
    boxShadow: '0 0 15px rgba(2, 132, 199, 0.5)',
  },
  logoIcon: { fontSize: '26px', color: '#ffffff', fontWeight: 'bold' },
  brandTitle: { margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff' },
  brandSubtitle: { margin: 0, fontSize: '12px', color: '#38bdf8', fontWeight: '600' },
  navActions: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  navTab: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
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
    border: '1px solid #38bdf8',
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
    fontWeight: '700',
    fontSize: '13px',
    border: '1px solid #0284c7',
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
    width: '100%',
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0f172a 100%)',
    color: '#ffffff',
    padding: '50px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #1e293b',
    boxSizing: 'border-box',
  },
  heroContent: { maxWidth: '900px', margin: '0 auto' },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    display: 'inline-block',
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 12px 0',
    lineHeight: '1.25',
  },
  heroSub: {
    fontSize: '15px',
    color: '#e0f2fe',
    margin: 0,
    lineHeight: '1.6',
  },
  mainContainer: {
    width: '100%',
    padding: '32px 32px',
    boxSizing: 'border-box',
  },
  alert: {
    backgroundColor: '#064e3b',
    color: '#6ee7b7',
    border: '1px solid #10b981',
    padding: '14px 20px',
    borderRadius: '10px',
    marginBottom: '28px',
    fontWeight: '600',
  },
  sectionHeader: { marginBottom: '24px' },
  sectionTitle: { color: '#f8fafc', fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0' },
  sectionSubtitle: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  loadingBox: { textAlign: 'center', padding: '60px 0' },
  loadingText: { color: '#94a3b8', fontWeight: '500' },
  fullGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid #334155',
  },
  imageContainer: { height: '200px', overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  rxBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  productName: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: '#f8fafc' },
  productDesc: { fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0', flexGrow: 1, lineHeight: '1.5' },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #334155',
  },
  priceLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' },
  price: { fontSize: '18px', fontWeight: '800', color: '#38bdf8' },
  stock: { fontSize: '12px', color: '#34d399', fontWeight: '600' },
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
  },
};

export default App; 