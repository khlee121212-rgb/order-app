const API_BASE =
  import.meta.env.VITE_API_URL ?? https://order-app-backend-c7et.onrender.com;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = '요청 처리에 실패했습니다.';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // 응답 본문이 JSON이 아닐 수 있음
    }
    throw new Error(message);
  }

  return res.json();
}

// 메뉴
export const getMenus = () => request('/menus');
export const updateStock = (menuId, delta) =>
  request(`/menus/${menuId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ delta }),
  });

// 주문
export const getOrders = () => request('/orders');
export const getOrder = (id) => request(`/orders/${id}`);
export const createOrder = (items) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
export const advanceOrderStatus = (id) =>
  request(`/orders/${id}/status`, { method: 'PATCH' });
