import pg from 'pg';

const { Pool } = pg;

// PostgreSQL 커넥션 풀 (환경 변수 기반)
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'coffee_order',
});

// 간단한 연결 확인용 헬퍼
export async function checkDbConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
}
