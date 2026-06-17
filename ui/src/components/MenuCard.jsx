import { useState } from 'react';
import { formatPrice } from '../utils/format';

function MenuCard({ menu, onAdd }) {
  const [selected, setSelected] = useState([]);
  const [imageError, setImageError] = useState(false);

  const options = menu.options || [];
  const soldOut = menu.stock <= 0;

  function toggleOption(optionId) {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  }

  function handleAdd() {
    const chosen = options.filter((opt) => selected.includes(opt.id));
    onAdd(menu, chosen);
    setSelected([]);
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image">
        {menu.imageUrl && !imageError ? (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="menu-card__placeholder" aria-hidden="true" />
        )}
        {soldOut && <span className="menu-card__soldout">품절</span>}
      </div>

      <h3 className="menu-card__name">{menu.name}</h3>
      <p className="menu-card__price">{formatPrice(menu.price)}</p>
      <p className="menu-card__desc">{menu.description}</p>

      <ul className="menu-card__options">
        {options.map((opt) => (
          <li key={opt.id}>
            <label className="menu-card__option">
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggleOption(opt.id)}
                disabled={soldOut}
              />
              <span>
                {opt.label ?? opt.name} (+{opt.price.toLocaleString('ko-KR')}원)
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn--primary menu-card__add"
        onClick={handleAdd}
        disabled={soldOut}
      >
        {soldOut ? '품절' : '담기'}
      </button>
    </article>
  );
}

export default MenuCard;
