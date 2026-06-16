import { formatDateTime, formatPrice } from '../utils/format';
import { ORDER_STATUS, STATUS_LABEL } from '../data/admin';

function formatItem(item) {
  const optionText =
    item.options.length > 0 ? `(${item.options.join(', ')})` : '';
  return `${item.name}${optionText} x ${item.quantity}`;
}

const STATUS_BADGE = {
  [ORDER_STATUS.RECEIVED]: 'badge--warning',
  [ORDER_STATUS.MAKING]: 'badge--info',
  [ORDER_STATUS.DONE]: 'badge--normal',
};

function Orders({ orders, onAdvance }) {
  const isEmpty = orders.length === 0;

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">주문 현황</h2>

      {isEmpty ? (
        <p className="orders__empty">주문 내역이 없습니다.</p>
      ) : (
        <ul className="orders">
          {orders.map((order) => (
            <li key={order.id} className="orders__row">
              <span className="orders__time">
                {formatDateTime(order.createdAt)}
              </span>

              <span className="orders__menu">
                {order.items.map((item, idx) => (
                  <span key={idx} className="orders__menu-item">
                    {formatItem(item)}
                  </span>
                ))}
              </span>

              <span className="orders__price">{formatPrice(order.total)}</span>

              <span className={`badge ${STATUS_BADGE[order.status]}`}>
                {STATUS_LABEL[order.status]}
              </span>

              <span className="orders__action">
                {order.status === ORDER_STATUS.RECEIVED && (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => onAdvance(order.id)}
                  >
                    제조 시작
                  </button>
                )}
                {order.status === ORDER_STATUS.MAKING && (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => onAdvance(order.id)}
                  >
                    제조 완료
                  </button>
                )}
                {order.status === ORDER_STATUS.DONE && (
                  <button type="button" className="btn" disabled>
                    완료
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Orders;
