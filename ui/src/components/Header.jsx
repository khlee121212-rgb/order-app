function Header({ active = 'order' }) {
  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__logo">COZY</span>
        <nav className="header__nav">
          <a
            href="#order"
            className={
              'header__nav-link' +
              (active === 'order' ? ' header__nav-link--active' : '')
            }
          >
            주문하기
          </a>
          <a
            href="#admin"
            className={
              'header__nav-link' +
              (active === 'admin' ? ' header__nav-link--active' : '')
            }
          >
            관리자
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
