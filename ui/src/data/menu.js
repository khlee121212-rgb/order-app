// 커피 메뉴 임시 데이터 (추후 백엔드 API 연동 예정)
export const MENU = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    price: 4000,
    description: '깔끔하고 시원한 아이스 아메리카노',
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    price: 4000,
    description: '진하고 따뜻한 핫 아메리카노',
    image:
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80',
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
  },
  {
    id: 'cappuccino',
    name: '카푸치노',
    price: 5000,
    description: '풍성한 우유 거품이 매력적인 커피',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
  },
  {
    id: 'vanilla-latte',
    name: '바닐라라떼',
    price: 5500,
    description: '달콤한 바닐라 향이 더해진 라떼',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
  },
  {
    id: 'cold-brew',
    name: '콜드브루',
    price: 4500,
    description: '차갑게 우려낸 깊고 부드러운 풍미',
    image:
      'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80',
  },
];

// 메뉴 공통 옵션 (추가 금액 단위: 원)
export const OPTIONS = [
  { id: 'extra-shot', label: '샷 추가', price: 500 },
  { id: 'syrup', label: '시럽 추가', price: 0 },
];
