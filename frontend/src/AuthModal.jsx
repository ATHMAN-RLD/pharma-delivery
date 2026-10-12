import { useState } from 'react';

function AuthModal({ onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isRegister ? 'register.php' : 'login.php';

    try {
      const res = await fetch(`http://localhost/pharma-api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        setErrorMsg(`PHP Server Error: ${responseText.substring(0, 100)}`);
        setLoading(false);
        return;
      }

      if (data.status === 'success') {
        if (isRegister) {
          setIsRegister(false);
          setErrorMsg('Account created! You can now log in.');
        } else {
          localStorage.setItem('pharma_user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
        }
      } else {
        setErrorMsg(data.message || 'Action failed.');
      }
    } catch (err) {
      setErrorMsg(`Connection error: ${err.message}. Verify XAMPP is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Helper check to decide if alert should be green (success) or red (error)
  const isSuccessMessage = errorMsg.includes('Account created');

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {isRegister ? '🔑 Create Account' : '🔒 Login'}
          </h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {errorMsg && (
          <p
            style={{
              ...styles.alertBase,
              ...(isSuccessMessage ? styles.successAlert : styles.errorAlert),
            }}
          >
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              required
              value={formData.full_name}
              onChange={handleChange}
              style={styles.input}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          {isRegister && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="customer">Role: Customer</option>
              <option value="admin">Role: Pharmacy Admin</option>
            </select>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={styles.toggleLink}
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
          >
            {isRegister ? 'Login here' : 'Register here'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '30px',
    width: '90%',
    maxWidth: '420px',
    border: '1px solid #334155',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#f8fafc', fontSize: '20px', fontWeight: '800' },
  closeBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' },
  alertBase: {
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    fontWeight: '600',
  },
  errorAlert: {
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    border: '1px solid #ef4444',
  },
  successAlert: {
    backgroundColor: '#064e3b',
    color: '#6ee7b7',
    border: '1px solid #10b981',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '14px',
  },
  submitBtn: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px',
  },
  toggleText: { color: '#94a3b8', fontSize: '13px', textAlign: 'center', marginTop: '18px' },
  toggleLink: { color: '#38bdf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' },
};

export default AuthModal; 