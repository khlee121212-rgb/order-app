// 금액을 천 단위 콤마와 '원' 단위로 표기
export function formatPrice(value) {
  return `${value.toLocaleString('ko-KR')}원`;
}

// 주문 일시를 'M월 D일 HH:MM' 형태로 표기
export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${month}월 ${day}일 ${hh}:${mm}`;
}
