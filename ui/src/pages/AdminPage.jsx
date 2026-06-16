import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory';
import Orders from '../components/Orders';
import {
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  ORDER_STATUS,
} from '../data/admin';

const NEXT_STATUS = {
  [ORDER_STATUS.RECEIVED]: ORDER_STATUS.MAKING,
  [ORDER_STATUS.MAKING]: ORDER_STATUS.DONE,
};

function AdminPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  function handleIncrease(id) {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: item.stock + 1 } : item
      )
    );
  }

  function handleDecrease(id) {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock - 1) }
          : item
      )
    );
  }

  function handleAdvance(id) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id && NEXT_STATUS[order.status]
          ? { ...order, status: NEXT_STATUS[order.status] }
          : order
      )
    );
  }

  const stats = useMemo(() => {
    return {
      total: orders.length,
      received: orders.filter((o) => o.status === ORDER_STATUS.RECEIVED)
        .length,
      making: orders.filter((o) => o.status === ORDER_STATUS.MAKING).length,
      done: orders.filter((o) => o.status === ORDER_STATUS.DONE).length,
    };
  }, [orders]);

  return (
    <div className="page">
      <Header active="admin" />

      <main className="page__content">
        <Dashboard stats={stats} />
        <Inventory
          items={inventory}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
        <Orders orders={orders} onAdvance={handleAdvance} />
      </main>
    </div>
  );
}

export default AdminPage;
