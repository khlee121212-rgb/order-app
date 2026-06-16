function Dashboard({ stats }) {
  const cards = [
    { key: 'total', label: '총 주문', value: stats.total },
    { key: 'received', label: '주문 접수', value: stats.received },
    { key: 'making', label: '제조 중', value: stats.making },
    { key: 'done', label: '제조 완료', value: stats.done },
  ];

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">관리자 대시보드</h2>
      <div className="dashboard">
        {cards.map((card) => (
          <div key={card.key} className="dashboard__card">
            <span className="dashboard__label">{card.label}</span>
            <span className="dashboard__value">{card.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
