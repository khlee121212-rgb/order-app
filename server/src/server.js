import 'dotenv/config';
import { createApp } from './app.js';
import { checkDbConnection } from './db/pool.js';

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  const app = createApp();

  // DB 연결 확인 (실패해도 서버는 기동하되 경고만 출력)
  try {
    await checkDbConnection();
    console.log('[db] PostgreSQL 연결 성공');
  } catch (err) {
    console.warn('[db] PostgreSQL 연결 실패:', err.message);
    console.warn('[db] .env의 DB 설정을 확인하세요.');
  }

  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT} 에서 실행 중`);
  });
}

start();
