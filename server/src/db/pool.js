import pg from 'pg';

const { Pool } = pg;

// 값이 postgres 연결 문자열(postgresql://...)인지 판별
function isConnectionString(value) {
  return typeof value === 'string' && /^postgres(ql)?:\/\//i.test(value.trim());
}

// PostgreSQL 커넥션 풀
// - 연결 문자열(DATABASE_URL, 또는 실수로 DB_HOST에 들어간 URL)이 있으면 우선 사용 (예: Render).
//   원격 연결은 SSL 필요.
// - 없으면 개별 환경 변수(로컬 개발)로 연결.
const connectionString = isConnectionString(process.env.DATABASE_URL)
  ? process.env.DATABASE_URL.trim()
  : isConnectionString(process.env.DB_HOST)
    ? process.env.DB_HOST.trim()
    : null;

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
