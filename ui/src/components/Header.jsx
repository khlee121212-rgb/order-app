import { Link } from 'react-router-dom';

function Header({ active = 'order' }) {
  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__logo">COZY</span>
        <nav className="header__nav">
          <Link
            to="/"
            className={
              'header__nav-link' +
              (active === 'order' ? ' header__nav-link--active' : '')
            }
          >
            주문하기
          </Link>
          <Link
            to="/admin"
            className={
              'header__nav-link' +
              (active === 'admin' ? ' header__nav-link--active' : '')
            }
          >
            관리자
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
