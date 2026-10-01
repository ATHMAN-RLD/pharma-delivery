import { useEffect, useState } from 'react';

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost/pharma-api/get_orders.php');
      const data = await res.json();
      if (data.status === 'success') {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.dashboardWrapper}>
      <div style={styles.dashHeader}>
        <div>
          <h2 style={styles.dashTitle}>📦 Order Management Dashboard</h2>
          <p style={styles.dashSubtitle}>Real-time order tracking and dispatch status in MySQL</p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchOrders}>🔄 Refresh Data</button>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #0284c7' }}>
          <span style={styles.kpiLabel}>Total Orders</span>
          <span style={styles.kpiVal}>{orders.length}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #10b981' }}>
          <span style={styles.kpiLabel}>Active Deliveries</span>
          <span style={styles.kpiVal}>{orders.filter(o => o.status === 'pending' || o.status === 'dispatched').length}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #f59e0b' }}>
          <span style={styles.kpiLabel}>Total Revenue</span>
          <span style={styles.kpiVal}>
            KES {orders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div style={styles.tableCard}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>No orders placed yet. Place an order from the shop tab!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Delivery Address</th>
                  <th style={styles.th}>Payment Method</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={styles.tr}>
                    <td style={styles.td}><strong>#{ord.id}</strong></td>
                    <td style={styles.td}>{ord.phone || 'N/A'}</td>
                    <td style={styles.td}>{ord.delivery_address}</td>
                    <td style={styles.td}>
                      <span style={styles.methodBadge}>{ord.payment_method.toUpperCase()}</span>
                    </td>
                    <td style={styles.tdPrice}>KES {Number(ord.total_amount).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(ord.status)}>
                        ● {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.tdDate}>{new Date(ord.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboardWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dashHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  dashTitle: { margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a', fontWeight: '800' },
  dashSubtitle: { margin: 0, fontSize: '14px', color: '#64748b' },
  refreshBtn: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  kpiLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },
  kpiVal: { fontSize: '24px', fontWeight: '800', color: '#0f172a' },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' },
  th: { padding: '14px 16px', color: '#475569', fontWeight: '700' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', color: '#1e293b' },
  tdPrice: { padding: '14px 16px', color: '#0284c7', fontWeight: '700' },
  tdDate: { padding: '14px 16px', color: '#64748b', fontSize: '12px' },
  methodBadge: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
  statusBadge: (status) => ({
    backgroundColor: status === 'completed' ? '#dcfce7' : status === 'dispatched' ? '#e0f2fe' : '#fef3c7',
    color: status === 'completed' ? '#15803d' : status === 'dispatched' ? '#0369a1' : '#b45309',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-block',
  }),
};

export default OrderDashboard; 