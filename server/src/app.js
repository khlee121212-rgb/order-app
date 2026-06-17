import express from 'express';
import cors from 'cors';
import menusRouter from './routes/menus.js';
import ordersRouter from './routes/orders.js';

export function createApp() {
  const app = express();

  // CLIENT_ORIGIN: 쉼표로 여러 출처 지정 가능. 끝 슬래시는 정규화.
  // 미설정 시에는 모든 출처 허용(인증/쿠키 미사용 학습용 앱).
  const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : true,
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
