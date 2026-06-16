function getStockStatus(stock) {
  if (stock === 0) return { label: '품절', className: 'badge--sold-out' };
  if (stock < 5) return { label: '주의', className: 'badge--warning' };
  return { label: '정상', className: 'badge--normal' };
}

function Inventory({ items, onIncrease, onDecrease }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__title">재고 현황</h2>
      <div className="inventory">
        {items.map((item) => {
          const status = getStockStatus(item.stock);
          return (
            <div key={item.id} className="inventory__card">
              <div className="inventory__head">
                <span className="inventory__name">{item.name}</span>
              </div>

              <div className="inventory__status">
                <span className="inventory__stock">{item.stock}개</span>
                <span className={`badge ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <div className="inventory__controls">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => onDecrease(item.id)}
                  disabled={item.stock === 0}
                  aria-label="재고 감소"
                >
                  −
                </button>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => onIncrease(item.id)}
                  aria-label="재고 증가"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Inventory;
