import { formatPrice } from '../utils/format';

function Cart({ items, total, onOrder }) {
  const isEmpty = items.length === 0;

  return (
    <section className="cart">
      <h2 className="cart__title">장바구니</h2>

      <div className="cart__body">
        <div className="cart__left">
          {isEmpty ? (
            <p className="cart__empty">담은 메뉴가 없습니다.</p>
          ) : (
            <ul className="cart__list">
              {items.map((item) => (
                <li key={item.key} className="cart__item">
                  <span className="cart__item-name">
                    {item.name}
                    {item.optionLabels.length > 0 && (
                      <span className="cart__item-options">
                        {' '}
                        ({item.optionLabels.join(', ')})
                      </span>
                    )}
                  </span>
                  <span className="cart__item-qty">X {item.quantity}</span>
                  <span className="cart__item-price">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart__right">
          <p className="cart__total">
            <span className="cart__total-label">총 금액</span>
            <strong className="cart__total-value">{formatPrice(total)}</strong>
          </p>
          <button
            type="button"
            className="btn btn--primary cart__order"
            onClick={onOrder}
            disabled={isEmpty}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  );
}

export default Cart;
