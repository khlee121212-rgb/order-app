// 금액을 천 단위 콤마와 '원' 단위로 표기
export function formatPrice(value) {
  return `${value.toLocaleString('ko-KR')}원`;
}
