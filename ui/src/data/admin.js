// 관리자 화면 임시 데이터 (추후 백엔드 API 연동 예정)

// 재고 현황 (메뉴 3개)
export const INITIAL_INVENTORY = [
  { id: 'americano-ice', name: '아메리카노(ICE)', stock: 10 },
  { id: 'americano-hot', name: '아메리카노(HOT)', stock: 3 },
  { id: 'cafe-latte', name: '카페라떼', stock: 0 },
];

// 주문 상태 정의
export const ORDER_STATUS = {
  RECEIVED: 'received', // 주문 접수
  MAKING: 'making', // 제조 중
  DONE: 'done', // 제조 완료
};

export const STATUS_LABEL = {
  [ORDER_STATUS.RECEIVED]: '주문 접수',
  [ORDER_STATUS.MAKING]: '제조 중',
  [ORDER_STATUS.DONE]: '제조 완료',
};

// 주문 현황 (접수된 주문 예시)
export const INITIAL_ORDERS = [
  {
    id: 1,
    createdAt: '2026-06-17T13:00:00',
    items: [{ name: '아메리카노(ICE)', options: [], quantity: 1 }],
    total: 4000,
    status: ORDER_STATUS.RECEIVED,
  },
  {
    id: 2,
    createdAt: '2026-06-17T13:12:00',
    items: [
      { name: '카페라떼', options: ['샷 추가'], quantity: 2 },
      { name: '아메리카노(HOT)', options: [], quantity: 1 },
    ],
    total: 15000,
    status: ORDER_STATUS.MAKING,
  },
];
