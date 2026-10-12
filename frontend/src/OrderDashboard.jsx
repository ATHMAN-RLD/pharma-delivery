import { useEffect, useState } from 'react';

function OrderDashboard({ currentUser }) {
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('http://localhost/pharma-api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
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

      <div style={styles.tableCard}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>No orders placed yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  {currentUser?.role === 'admin' && <th style={styles.th}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={styles.tr}>
                    <td style={styles.td}><strong>#{ord.id}</strong></td>
                    <td style={styles.td}>{ord.phone || 'N/A'}</td>
                    <td style={styles.td}>{ord.delivery_address}</td>
                    <td style={styles.td}><span style={styles.methodBadge}>{ord.payment_method.toUpperCase()}</span></td>
                    <td style={styles.tdPrice}>KES {Number(ord.total_amount).toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(ord.status)}>● {ord.status.toUpperCase()}</span>
                    </td>
                    {currentUser?.role === 'admin' && (
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button style={styles.actionBtn('#0284c7')} onClick={() => updateStatus(ord.id, 'dispatched')}>Dispatch</button>
                          <button style={styles.actionBtn('#10b981')} onClick={() => updateStatus(ord.id, 'completed')}>Complete</button>
                        </div>
                      </td>
                    )}
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
  dashboardWrapper: { width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' },
  dashHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  dashTitle: { margin: '0 0 4px 0', fontSize: '24px', color: '#f8fafc', fontWeight: '800' },
  dashSubtitle: { margin: 0, fontSize: '14px', color: '#94a3b8' },
  refreshBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  kpiCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '6px' },
  kpiLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  kpiVal: { fontSize: '24px', fontWeight: '800', color: '#f8fafc' },
  tableCard: { backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { borderBottom: '2px solid #334155', backgroundColor: '#0f172a' },
  th: { padding: '14px 16px', color: '#94a3b8', fontWeight: '700' },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '14px 16px', color: '#f8fafc' },
  tdPrice: { padding: '14px 16px', color: '#38bdf8', fontWeight: '700' },
  methodBadge: { backgroundColor: '#0f172a', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
  statusBadge: (status) => ({
    backgroundColor: status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : status === 'dispatched' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(245, 158, 11, 0.2)',
    color: status === 'completed' ? '#34d399' : status === 'dispatched' ? '#38bdf8' : '#fbbf24',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
  }),
  actionBtn: (color) => ({
    backgroundColor: color,
    color: '#ffffff',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
  }),
};

export default OrderDashboard; 