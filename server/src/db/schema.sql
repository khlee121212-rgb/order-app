-- 커피 주문 앱 스키마 (docs/PRD.md 19. 데이터 모델 기준)

DROP TABLE IF EXISTS order_item_options CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS menus CASCADE;

-- 메뉴
CREATE TABLE menus (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       INTEGER NOT NULL,
  image_url   VARCHAR(500),
  stock       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 옵션 (메뉴에 연결)
CREATE TABLE options (
  id      SERIAL PRIMARY KEY,
  menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  name    VARCHAR(100) NOT NULL,
  price   INTEGER NOT NULL DEFAULT 0
);

-- 주문
CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  status       VARCHAR(20) NOT NULL DEFAULT 'received',
  total_amount INTEGER NOT NULL DEFAULT 0
);

-- 주문 항목 (주문 내용)
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id    INTEGER REFERENCES menus(id),
  menu_name  VARCHAR(100) NOT NULL,
  quantity   INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  amount     INTEGER NOT NULL
);

-- 주문 항목 옵션
CREATE TABLE order_item_options (
  id            SERIAL PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  option_name   VARCHAR(100) NOT NULL,
  option_price  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_options_menu_id ON options(menu_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_item_options_item_id ON order_item_options(order_item_id);
