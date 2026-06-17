import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// GET /api/menus - 메뉴 목록(옵션 포함) 조회
router.get('/', async (req, res, next) => {
  try {
    const menusResult = await pool.query(
      `SELECT id, name, description, price, image_url, stock
       FROM menus ORDER BY id`
    );
    const optionsResult = await pool.query(
      `SELECT id, menu_id, name, price FROM options ORDER BY id`
    );

    const optionsByMenu = new Map();
    for (const opt of optionsResult.rows) {
      if (!optionsByMenu.has(opt.menu_id)) optionsByMenu.set(opt.menu_id, []);
      optionsByMenu.get(opt.menu_id).push({
        id: opt.id,
        name: opt.name,
        price: opt.price,
      });
    }

    const menus = menusResult.rows.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      price: m.price,
      imageUrl: m.image_url,
      stock: m.stock,
      options: optionsByMenu.get(m.id) || [],
    }));

    res.json(menus);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/menus/:id/stock - 재고 증감 (관리자)
router.patch('/:id/stock', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (typeof delta !== 'number' || !Number.isInteger(delta)) {
      return res.status(400).json({ error: 'delta(정수)가 필요합니다.' });
    }

    const result = await pool.query(
      `UPDATE menus SET stock = GREATEST(0, stock + $1)
       WHERE id = $2 RETURNING id, name, stock`,
      [delta, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '메뉴를 찾을 수 없습니다.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
