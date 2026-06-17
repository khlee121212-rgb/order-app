import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// 주문 상태 전환 흐름
const STATUS_FLOW = { received: 'making', making: 'done' };

// 주문 단건을 항목/옵션까지 조립해서 반환
async function fetchOrder(db, id) {
  const orderRes = await db.query(
    `SELECT id, created_at, status, total_amount FROM orders WHERE id = $1`,
    [id]
  );
  if (orderRes.rowCount === 0) return null;
  const order = orderRes.rows[0];

  const itemsRes = await db.query(
    `SELECT id, menu_id, menu_name, quantity, unit_price, amount
     FROM order_items WHERE order_id = $1 ORDER BY id`,
    [id]
  );

  const itemIds = itemsRes.rows.map((r) => r.id);
  const optionsByItem = new Map();
  if (itemIds.length > 0) {
    const optsRes = await db.query(
      `SELECT order_item_id, option_name, option_price
       FROM order_item_options WHERE order_item_id = ANY($1) ORDER BY id`,
      [itemIds]
    );
    for (const o of optsRes.rows) {
      if (!optionsByItem.has(o.order_item_id)) {
        optionsByItem.set(o.order_item_id, []);
      }
      optionsByItem.get(o.order_item_id).push({
        name: o.option_name,
        price: o.option_price,
      });
    }
  }

  return {
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    totalAmount: order.total_amount,
    items: itemsRes.rows.map((r) => ({
      menuId: r.menu_id,
      menuName: r.menu_name,
      quantity: r.quantity,
      unitPrice: r.unit_price,
      amount: r.amount,
      options: optionsByItem.get(r.id) || [],
    })),
  };
}

// GET /api/orders - 주문 목록(최신순)
router.get('/', async (req, res, next) => {
  try {
    const idsRes = await pool.query(
      `SELECT id FROM orders ORDER BY created_at DESC, id DESC`
    );
    const orders = [];
    for (const row of idsRes.rows) {
      orders.push(await fetchOrder(pool, row.id));
    }
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - 주문 단건 조회
router.get('/:id', async (req, res, next) => {
  try {
    const order = await fetchOrder(pool, req.params.id);
    if (!order) {
      return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders - 주문 생성 + 재고 차감 (트랜잭션)
router.post('/', async (req, res, next) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '주문 항목이 필요합니다.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query(
      `INSERT INTO orders (status, total_amount) VALUES ('received', 0) RETURNING id`
    );
    const orderId = orderRes.rows[0].id;
    let total = 0;

    for (const item of items) {
      const { menuId, quantity, optionIds = [] } = item;
      if (!menuId || !Number.isInteger(quantity) || quantity < 1) {
        throw Object.assign(new Error('잘못된 주문 항목입니다.'), {
          status: 400,
        });
      }

      // 동시성 안전을 위해 메뉴 행 잠금
      const menuRes = await client.query(
        `SELECT id, name, price, stock FROM menus WHERE id = $1 FOR UPDATE`,
        [menuId]
      );
      if (menuRes.rowCount === 0) {
        throw Object.assign(new Error('메뉴를 찾을 수 없습니다.'), {
          status: 404,
        });
      }
      const menu = menuRes.rows[0];
      if (menu.stock < quantity) {
        throw Object.assign(
          new Error(`재고가 부족합니다: ${menu.name}`),
          { status: 409 }
        );
      }

      let options = [];
      if (optionIds.length > 0) {
        const optRes = await client.query(
          `SELECT id, name, price FROM options WHERE id = ANY($1) AND menu_id = $2`,
          [optionIds, menuId]
        );
        options = optRes.rows;
      }

      const optionSum = options.reduce((sum, o) => sum + o.price, 0);
      const unitPrice = menu.price + optionSum;
      const amount = unitPrice * quantity;
      total += amount;

      const itemRes = await client.query(
        `INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, amount)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [orderId, menu.id, menu.name, quantity, unitPrice, amount]
      );
      const orderItemId = itemRes.rows[0].id;

      for (const o of options) {
        await client.query(
          `INSERT INTO order_item_options (order_item_id, option_name, option_price)
           VALUES ($1, $2, $3)`,
          [orderItemId, o.name, o.price]
        );
      }

      await client.query(
        `UPDATE menus SET stock = stock - $1 WHERE id = $2`,
        [quantity, menu.id]
      );
    }

    await client.query(`UPDATE orders SET total_amount = $1 WHERE id = $2`, [
      total,
      orderId,
    ]);
    await client.query('COMMIT');

    const order = await fetchOrder(pool, orderId);
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// PATCH /api/orders/:id/status - 상태 다음 단계로 전환
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cur = await pool.query(`SELECT status FROM orders WHERE id = $1`, [
      id,
    ]);
    if (cur.rowCount === 0) {
      return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
    }
    const nextStatus = STATUS_FLOW[cur.rows[0].status];
    if (!nextStatus) {
      return res
        .status(400)
        .json({ error: '더 이상 변경할 수 없는 상태입니다.' });
    }
    await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [
      nextStatus,
      id,
    ]);
    const order = await fetchOrder(pool, id);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
