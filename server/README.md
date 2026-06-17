# 커피 주문 앱 - 백엔드 (server)

Express.js 기반 REST API 서버입니다. (Node.js + Express + PostgreSQL)

## 요구 사항
- Node.js 18 이상
- PostgreSQL 13 이상

## 설치
```bash
npm install
```

## 환경 변수
`.env` 파일에 다음 값을 설정합니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| PORT | 서버 포트 | 4000 |
| CLIENT_ORIGIN | CORS 허용 프런트엔드 주소 | http://localhost:5173 |
| DB_HOST | PostgreSQL 호스트 | localhost |
| DB_PORT | PostgreSQL 포트 | 5432 |
| DB_USER | DB 사용자 | postgres |
| DB_PASSWORD | DB 비밀번호 | postgres |
| DB_NAME | DB 이름 | coffee_order |

## 실행
```bash
npm run dev    # 개발 모드 (nodemon, 자동 재시작)
npm start      # 운영 모드
```

## 디렉터리 구조
```
server/
├─ src/
│  ├─ server.js      # 진입점 (서버 기동)
│  ├─ app.js         # Express 앱/미들웨어/라우터 설정
│  └─ db/
│     └─ pool.js     # PostgreSQL 커넥션 풀
├─ .env
└─ package.json
```

## 헬스 체크
서버 실행 후:
```bash
curl http://localhost:4000/api/health
```
