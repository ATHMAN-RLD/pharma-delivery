import { useState } from 'react';

function CheckoutModal({ product, currentUser, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setStatusMsg('Saving order details...');

    try {
      const orderRes = await fetch('http://localhost/pharma-api/create_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser ? currentUser.id : null,
          phone: phone,
          delivery_address: address,
          total_amount: product.price,
          payment_method: paymentMethod,
        }),
      });

      const orderData = await orderRes.json();
      if (orderData.status !== 'success') {
        setErrorMsg(orderData.message || 'Failed to save order.');
        setLoading(false);
        return;
      }

      if (paymentMethod === 'mpesa') {
        setStatusMsg('Sending M-Pesa STK Push...');
        const mpesaRes = await fetch('http://localhost/pharma-api/mpesa_stk.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, amount: product.price }),
        });

        const mpesaData = await mpesaRes.json();
        if (mpesaData.status === 'success' || mpesaData.status === 'simulated') {
          onSuccess(orderData.order_id, product.name, mpesaData.message);
          onClose();
        } else {
          setErrorMsg(mpesaData.message);
        }
      } else {
        setStatusMsg('Processing Card payment...');
        setTimeout(() => {
          onSuccess(orderData.order_id, product.name, `Card payment of KES ${product.price} completed successfully!`);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>💳 Secure Checkout</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.tabContainer}>
          <button
            style={paymentMethod === 'mpesa' ? styles.activeTab : styles.tab}
            onClick={() => setPaymentMethod('mpesa')}
          >
            📱 M-Pesa Express
          </button>
          <button
            style={paymentMethod === 'card' ? styles.activeTab : styles.tab}
            onClick={() => setPaymentMethod('card')}
          >
            💳 Credit / Debit Card
          </button>
        </div>

        <div style={styles.itemSummary}>
          <span style={styles.itemName}>{product?.name || 'Medicine Order'}</span>
          <span style={styles.itemPrice}>KES {Number(product?.price || 0).toLocaleString()}</span>
        </div>

        {statusMsg && !errorMsg && <p style={styles.infoAlert}>⏳ {statusMsg}</p>}
        {errorMsg && <p style={styles.errorAlert}>{errorMsg}</p>}

        <form onSubmit={handleCheckout} style={styles.form}>
          <div>
            <label style={styles.label}>Delivery Address</label>
            <input
              type="text"
              placeholder="e.g. Tudor / Nyali / Bamburi"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>

          {paymentMethod === 'card' && (
            <>
              <div>
                <label style={styles.label}>Card Number</label>
                <input
                  type="text"
                  placeholder="4000 0000 0000 0000"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={styles.payBtn}>
            {loading ? 'Processing...' : `Pay KES ${product?.price || 0}`}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px',
    width: '90%', maxWidth: '440px', border: '1px solid #334155',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { margin: 0, color: '#f8fafc', fontSize: '18px', fontWeight: '800' },
  closeBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' },
  tabContainer: { display: 'flex', gap: '8px', marginBottom: '16px' },
  tab: { flex: 1, padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
  activeTab: { flex: 1, padding: '10px', backgroundColor: '#0284c7', border: 'none', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' },
  itemSummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #334155' },
  itemName: { color: '#f8fafc', fontWeight: '700', fontSize: '14px' },
  itemPrice: { color: '#38bdf8', fontWeight: '800', fontSize: '15px' },
  infoAlert: { backgroundColor: '#0284c7', color: '#e0f2fe', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' },
  errorAlert: { backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: '600', marginBottom: '4px' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '13px', boxSizing: 'border-box' },
  payBtn: { backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', marginTop: '6px' },
};

export default CheckoutModal; 