import pg from 'pg';

const { Pool } = pg;

// PostgreSQL 커넥션 풀
// - DATABASE_URL(연결 문자열)이 있으면 우선 사용 (예: Render). 원격 연결은 SSL 필요.
// - 없으면 개별 환경 변수(로컬 개발)로 연결.
const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
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
