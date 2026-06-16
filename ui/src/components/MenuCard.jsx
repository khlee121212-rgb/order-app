import { useState } from 'react';
import { OPTIONS } from '../data/menu';
import { formatPrice } from '../utils/format';

function MenuCard({ menu, onAdd }) {
  const [selected, setSelected] = useState([]);
  const [imageError, setImageError] = useState(false);

  function toggleOption(optionId) {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  }

  function handleAdd() {
    const chosen = OPTIONS.filter((opt) => selected.includes(opt.id));
    onAdd(menu, chosen);
    setSelected([]);
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image">
        {menu.image && !imageError ? (
          <img
            src={menu.image}
            alt={menu.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="menu-card__placeholder" aria-hidden="true" />
        )}
      </div>

      <h3 className="menu-card__name">{menu.name}</h3>
      <p className="menu-card__price">{formatPrice(menu.price)}</p>
      <p className="menu-card__desc">{menu.description}</p>

      <ul className="menu-card__options">
        {OPTIONS.map((opt) => (
          <li key={opt.id}>
            <label className="menu-card__option">
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggleOption(opt.id)}
              />
              <span>
                {opt.label} (+{opt.price.toLocaleString('ko-KR')}원)
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button type="button" className="btn btn--primary menu-card__add" onClick={handleAdd}>
        담기
      </button>
    </article>
  );
}

export default MenuCard;
