import { useMemo, useState } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { MENU } from '../data/menu';

function buildCartKey(menuId, options) {
  const optionIds = options.map((opt) => opt.id).sort();
  return [menuId, ...optionIds].join('|');
}

function OrderPage() {
  const [cartItems, setCartItems] = useState([]);

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
          optionLabels: options.map((opt) => opt.label),
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

  function handleOrder() {
    if (cartItems.length === 0) return;
    // TODO: 백엔드 주문 API 연동
    alert('주문이 완료되었습니다.');
    setCartItems([]);
  }

  return (
    <div className="page">
      <Header active="order" />

      <main className="page__content">
        <section className="menu-list">
          {MENU.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
          ))}
        </section>

        <Cart items={cartItems} total={total} onOrder={handleOrder} />
      </main>
    </div>
  );
}

export default OrderPage;
