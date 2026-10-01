import { useEffect, useState } from 'react';
import DeliveryMap from './DeliveryMap';
import CheckoutModal from './CheckoutModal';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  // Stock imagery fallback mapping for realistic medical items
  const fallbackImages = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
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
      {/* Dynamic Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoBadge}>
            <span style={styles.logoIcon}>✚</span>
          </div>
          <div>
            <h1 style={styles.brandTitle}>PharmaExpress</h1>
            <p style={styles.brandSubtitle}>Mombasa 24/7 Rapid Healthcare</p>
          </div>
        </div>
        <div style={styles.cartBadge}>
          <span style={{ fontSize: '16px' }}>🛒</span>
          <span>Orders</span>
          <span style={styles.cartCount}>{cartCount}</span>
        </div>
      </header>

      {/* Hero Section with Pattern Overlay */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroTag}>🚀 Express Delivery in 30 Mins</span>
          <h2 style={styles.heroTitle}>Quality Medicines & Supplies Delivered across Mombasa</h2>
          <p style={styles.heroSub}>
            Order genuine pharmaceuticals, vitamins, and healthcare essentials right to your doorstep with instant M-Pesa verification.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <main style={styles.main}>
        {successNotice && (
          <div style={styles.alert}>
            🎉 {successNotice}
          </div>
        )}

        <div style={styles.sectionHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Featured Medicines & Medical Supplies</h3>
            <p style={styles.sectionSubtitle}>Verified items in stock at our central Mombasa pharmacy hub</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading healthcare inventory...</p>
          </div>
        ) : (
          <div style={styles.grid}>
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
                    <button
                      onClick={() => setSelectedProduct(item)}
                      style={styles.addButton}
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Delivery Tracking Map */}
        <DeliveryMap />
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
    backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    minHeight: '100vh',
    margin: 0,
    paddingBottom: '50px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 48px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    borderBottom: '3px solid #0284c7',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
  },
  logoIcon: { fontSize: '24px', color: '#ffffff', fontWeight: 'bold' },
  brandTitle: { margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' },
  brandSubtitle: { margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
  cartBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '8px 18px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '14px',
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
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0f172a 100%)',
    color: '#ffffff',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)',
  },
  heroContent: { maxWidth: '750px', margin: '0 auto' },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#38bdf8',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    display: 'inline-block',
    marginBottom: '16px',
    backdropFilter: 'blur(4px)',
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '0 0 12px 0',
    lineHeight: '1.2',
  },
  heroSub: {
    fontSize: '16px',
    color: '#e0f2fe',
    margin: 0,
    lineHeight: '1.5',
    opacity: 0.9,
  },
  main: {
    maxWidth: '1140px',
    margin: '40px auto 0 auto',
    padding: '0 20px',
  },
  alert: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    border: '1px solid #86efac',
    padding: '14px 20px',
    borderRadius: '10px',
    marginBottom: '24px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)',
  },
  sectionHeader: { marginBottom: '24px' },
  sectionTitle: { color: '#0f172a', fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' },
  sectionSubtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  loadingBox: { textAlign: 'center', padding: '40px 0' },
  loadingText: { color: '#64748b', fontWeight: '500' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  imageContainer: {
    height: '190px',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  rxBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    color: '#38bdf8',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    backdropFilter: 'blur(4px)',
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  productName: { margin: '0 0 8px 0', fontSize: '17px', fontWeight: '700', color: '#0f172a' },
  productDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 16px 0',
    flexGrow: 1,
    lineHeight: '1.4',
  },
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