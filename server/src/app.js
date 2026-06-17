import express from 'express';
import cors from 'cors';
import menusRouter from './routes/menus.js';
import ordersRouter from './routes/orders.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    })
  );
  app.use(express.json());

  // 루트 안내
  app.get('/', (req, res) => {
    res.json({
      service: '커피 주문 앱 백엔드',
      status: 'running',
      endpoints: ['/api/health'],
    });
  });

  // 헬스 체크
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/menus', menusRouter);
  app.use('/api/orders', ordersRouter);

  // 404 처리
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // 공통 에러 처리
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}
