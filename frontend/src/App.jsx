import { useState } from 'react';
import ProductList from './ProductList';
import OrderDashboard from './OrderDashboard';
import CheckoutModal from './CheckoutModal';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: 1, full_name: 'Athman', role: 'admin' });
  const [activeTab, setActiveTab] = useState('store');
  const [alertMsg, setAlertMsg] = useState('');

  const instagramHandle = "pharmaexpress_mombasa";
  const PHARMA_WHATSAPP_NUMBER = "254712345678"; 

  const handleWhatsAppOrder = (productName, price) => {
    const text = encodeURIComponent(`Hello PharmaExpress, I would like to order: ${productName} (Price: KES ${price})`);
    window.open(`https://wa.me/${PHARMA_WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handleInstagramClick = () => {
    window.open(`https://instagram.com/${instagramHandle}`, '_blank');
  };

  const handleOrderSuccess = (orderId, productName, message) => {
    setAlertMsg(`🎉 Order #${orderId} for "${productName}" placed! ${message}`);
    setActiveTab('dashboard');
  };

  return (
    <div style={styles.appContainer}>
      <nav style={styles.nav}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>+</div>
          <div>
            <h1 style={styles.brandTitle}>PharmaExpress</h1>
            <p style={styles.brandSubtitle}>Mombasa 24/7 Rapid Healthcare & Logistics</p>
          </div>
        </div>

        <div style={styles.navActions}>
          <button style={styles.waBtn} onClick={() => window.open(`https://wa.me/${PHARMA_WHATSAPP_NUMBER}`, '_blank')}>
            📱 WhatsApp
          </button>
          <button style={styles.igBtn} onClick={handleInstagramClick}>
            📷 Instagram
          </button>
          <button 
            style={activeTab === 'store' ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => setActiveTab('store')}
          >
            🛒 Store
          </button>
          <button 
            style={activeTab === 'dashboard' ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {alertMsg && (
          <div style={styles.alertBar}>
            {alertMsg}
            <button style={styles.closeAlert} onClick={() => setAlertMsg('')}>✕</button>
          </div>
        )}

        {activeTab === 'store' ? (
          <ProductList 
            onOrderOnline={(product) => setSelectedProduct(product)} 
            onOrderWhatsApp={handleWhatsAppOrder} 
          />
        ) : (
          <OrderDashboard currentUser={currentUser} />
        )}
      </main>

      {selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          currentUser={currentUser} 
          onClose={() => setSelectedProduct(null)} 
          onSuccess={handleOrderSuccess} 
        />
      )}
    </div>
  );
}

const styles = {
  appContainer: { backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { backgroundColor: '#06b6d4', color: '#ffffff', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px' },
  brandTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff' },
  brandSubtitle: { margin: 0, fontSize: '11px', color: '#94a3b8' },
  navActions: { display: 'flex', gap: '10px' },
  waBtn: { backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' },
  igBtn: { backgroundColor: '#ec4899', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' },
  navBtn: { backgroundColor: '#334155', color: '#f8fafc', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' },
  activeNavBtn: { backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' },
  main: { padding: '24px 32px' },
  alertBar: { backgroundColor: '#065f46', color: '#a7f3d0', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '600' },
  closeAlert: { background: 'none', border: 'none', color: '#a7f3d0', fontSize: '16px', cursor: 'pointer' }
};

export default App; 