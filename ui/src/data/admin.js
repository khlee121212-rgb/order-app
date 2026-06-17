// 주문 상태 정의 (백엔드 status 값과 일치)
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
