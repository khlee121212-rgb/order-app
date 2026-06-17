import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory';
import Orders from '../components/Orders';
import { ORDER_STATUS } from '../data/admin';
import {
  getMenus,
  getOrders,
  updateStock,
  advanceOrderStatus,
} from '../api';

function AdminPage() {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [menus, ordersData] = await Promise.all([getMenus(), getOrders()]);
      setInventory(
        menus.map((m) => ({ id: m.id, name: m.name, stock: m.stock }))
      );
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleChangeStock(id, delta) {
    try {
      const updated = await updateStock(id, delta);
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: updated.stock } : item
        )
      );
    } catch (err) {
      alert(`재고 변경에 실패했습니다: ${err.message}`);
    }
  }

  async function handleAdvance(id) {
    try {
      const updated = await advanceOrderStatus(id);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updated : order))
      );
    } catch (err) {
      alert(`상태 변경에 실패했습니다: ${err.message}`);
    }
  }

  const stats = useMemo(
    () => ({
      total: orders.length,
      received: orders.filter((o) => o.status === ORDER_STATUS.RECEIVED).length,
      making: orders.filter((o) => o.status === ORDER_STATUS.MAKING).length,
      done: orders.filter((o) => o.status === ORDER_STATUS.DONE).length,
    }),
    [orders]
  );

  return (
    <div className="page">
      <Header active="admin" />

      <main className="page__content">
        {loading && <p className="state-text">데이터를 불러오는 중...</p>}
        {error && (
          <p className="state-text state-text--error">
            데이터를 불러오지 못했습니다: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <Dashboard stats={stats} />
            <Inventory
              items={inventory}
              onIncrease={(id) => handleChangeStock(id, 1)}
              onDecrease={(id) => handleChangeStock(id, -1)}
            />
            <Orders orders={orders} onAdvance={handleAdvance} />
          </>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
