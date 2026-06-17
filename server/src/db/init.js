import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));

// 시드 메뉴 (이름, 설명, 가격, 이미지, 재고)
const SEED_MENUS = [
  {
    name: '아메리카노(ICE)',
    description: '깔끔하고 시원한 아이스 아메리카노',
    price: 4000,
    image_url: '/images/americano-ice.jpg',
    stock: 10,
  },
  {
    name: '아메리카노(HOT)',
    description: '진하고 따뜻한 핫 아메리카노',
    price: 4000,
    image_url: '/images/americano-hot.jpg',
    stock: 10,
  },
  {
    name: '카페라떼',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 5000,
    image_url: '/images/caffe-latte.jpg',
    stock: 7,
  },
  {
    name: '카푸치노',
    description: '풍성한 우유 거품이 매력적인 커피',
    price: 5000,
    image_url:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    stock: 5,
  },
  {
    name: '바닐라라떼',
    description: '달콤한 바닐라 향이 더해진 라떼',
    price: 5500,
    image_url:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    stock: 4,
  },
  {
    name: '콜드브루',
    description: '차갑게 우려낸 깊고 부드러운 풍미',
    price: 4500,
    image_url:
      'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80',
    stock: 0,
  },
];

// 메뉴마다 공통으로 추가할 옵션
const SEED_OPTIONS = [
  { name: '샷 추가', price: 500 },
  { name: '시럽 추가', price: 0 },
];

async function init() {
  const schemaSql = readFileSync(schemaPath, 'utf-8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schemaSql);

    for (const menu of SEED_MENUS) {
      const menuRes = await client.query(
        `INSERT INTO menus (name, description, price, image_url, stock)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [menu.name, menu.description, menu.price, menu.image_url, menu.stock]
      );
      const menuId = menuRes.rows[0].id;
      for (const opt of SEED_OPTIONS) {
        await client.query(
          `INSERT INTO options (menu_id, name, price) VALUES ($1, $2, $3)`,
          [menuId, opt.name, opt.price]
        );
      }
    }

    await client.query('COMMIT');
    console.log(
      `[init] 스키마 생성 및 시드 완료 (메뉴 ${SEED_MENUS.length}개)`
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[init] 실패:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

init();
