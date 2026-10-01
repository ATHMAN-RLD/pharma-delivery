import { useState } from 'react';

function CheckoutModal({ product, onClose, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('Nyali, Mombasa');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      user_id: 1, // Default user created in MySQL
      total_amount: Number(product.price),
      payment_method: paymentMethod,
      delivery_address: address,
      phone: phoneNumber,
    };

    try {
      const res = await fetch('http://localhost/pharma-api/create_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === 'success') {
        onSuccess(data.order_id, product.name);
      } else {
        setErrorMsg(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Ensure XAMPP Apache is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Confirm Order</h3>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div style={styles.productSummary}>
          <strong>{product.name}</strong>
          <span style={styles.priceTag}>KES {Number(product.price).toLocaleString()}</span>
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Phone Number (M-Pesa / Contact):
            <input
              type="text"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Delivery Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Payment Option:
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={styles.select}
            >
              <option value="mpesa">M-Pesa Express</option>
              <option value="card">Credit / Debit Card</option>
            </select>
          </label>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={styles.confirmBtn}>
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  closeBtn: {
    border: 'none',
    background: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  productSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  priceTag: {
    color: '#0284c7',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    gap: '4px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    margin: '0 0 10px 0',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px',
  },
  cancelBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#e2e8f0',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#0284c7',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default CheckoutModal;  