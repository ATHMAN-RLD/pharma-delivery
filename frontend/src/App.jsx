import { useEffect, useState } from 'react';
import DeliveryMap from './DeliveryMap';
import CheckoutModal from './CheckoutModal';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

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
      {/* Header / Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navBrand}>
          <span style={styles.logoIcon}>💊</span>
          <div>
            <h1 style={styles.brandTitle}>PharmaExpress</h1>
            <p style={styles.brandSubtitle}>Mombasa Healthcare Delivery</p>
          </div>
        </div>
        <div style={styles.cartBadge}>
          🛒 Orders <span style={styles.cartCount}>{cartCount}</span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h2>Fast Prescription & Medical Delivery in Mombasa</h2>
        <p>Order healthcare products from verified pharmacies with M-Pesa & Card payment options.</p>
      </section>

      {/* Main Content */}
      <main style={styles.main}>
        {successNotice && (
          <div style={styles.alert}>
            ✅ {successNotice}
          </div>
        )}

        <h3 style={styles.sectionTitle}>Featured Medicines & Supplies</h3>

        {loading ? (
          <p style={styles.loadingText}>Loading products...</p>
        ) : (
          <div style={styles.grid}>
            {products.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.imageContainer}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'}
                    alt={item.name}
                    style={styles.image}
                  />
                </div>
                <div style={styles.cardBody}>
                  <h4 style={styles.productName}>{item.name}</h4>
                  <p style={styles.productDesc}>{item.description}</p>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>KES {Number(item.price).toLocaleString()}</span>
                    <span style={styles.stock}>In Stock ({item.stock_quantity})</span>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(item)}
                    style={styles.addButton}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Delivery Map */}
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
    margin: 0,
    paddingBottom: '40px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { fontSize: '32px' },
  brandTitle: { margin: 0, fontSize: '22px', fontWeight: '700' },
  brandSubtitle: { margin: 0, fontSize: '12px', opacity: 0.85 },
  cartBadge: {
    backgroundColor: '#ffffff',
    color: '#0284c7',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  cartCount: {
    backgroundColor: '#ef4444',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 8px',
    marginLeft: '6px',
    fontSize: '12px',
  },
  hero: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    textAlign: 'center',
    padding: '40px 20px',
  },
  main: {
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px',
  },
  alert: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    border: '1px solid #86efac',
    padding: '12px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  sectionTitle: { color: '#1e293b', fontSize: '20px', marginBottom: '20px' },
  loadingText: { textAlign: 'center', color: '#64748b' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  imageContainer: { height: '180px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  productName: { margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' },
  productDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 12px 0',
    flexGrow: 1,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  price: { fontSize: '16px', fontWeight: 'bold', color: '#0284c7' },
  stock: { fontSize: '12px', color: '#16a34a' },
  addButton: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
};

export default App; 