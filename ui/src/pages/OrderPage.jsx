import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { getMenus, createOrder } from '../api';

function buildCartKey(menuId, options) {
  const optionIds = options.map((opt) => opt.id).sort((a, b) => a - b);
  return [menuId, ...optionIds].join('|');
}

function OrderPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  async function loadMenus() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenus();
  }, []);

  function handleAdd(menu, options) {
    const key = buildCartKey(menu.id, options);
    const optionPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const unitPrice = menu.price + optionPrice;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          menuId: menu.id,
          name: menu.name,
          optionIds: options.map((opt) => opt.id),
          optionLabels: options.map((opt) => opt.name),
          unitPrice,
          quantity: 1,
        },
      ];
    });
  }

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      ),
    [cartItems]
  );

  async function handleOrder() {
    if (cartItems.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const payload = cartItems.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
        optionIds: item.optionIds,
      }));
      await createOrder(payload);
      alert('주문이 완료되었습니다.');
      setCartItems([]);
      loadMenus(); // 재고 변동 반영
    } catch (err) {
      alert(`주문에 실패했습니다: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Header active="order" />

      <main className="page__content">
        {loading && <p className="state-text">메뉴를 불러오는 중...</p>}
        {error && (
          <p className="state-text state-text--error">
            메뉴를 불러오지 못했습니다: {error}
          </p>
        )}

        {!loading && !error && (
          <section className="menu-list">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
            ))}
          </section>
        )}

        <Cart items={cartItems} total={total} onOrder={handleOrder} />
      </main>
    </div>
  );
}

export default OrderPage;
