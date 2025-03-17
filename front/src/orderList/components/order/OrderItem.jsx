import React from "react";
import '../order/orderitem.css'

const OrderItem = ({ order, onSelect }) => {
  const handleClick = () => {
    onSelect(order.orders_idx, order.order_status);
  }
  
  // 주문 상태별 클래스 지정
  const getStatusClass = (status) => {
    switch(status) {
      case '접수대기': return 'waiting';
      case '조리중': return 'cooking';
      case '배달중': return 'delivering';
      case '완료': return 'completed';
      default: return '';
    }
  }

  // 배달 예상시간 (임시 함수)
  // const getEstimatedTime = () => {
  //   if (order.order_status === '접수대기') return '20분 후';
  //   if (order.order_status === '조리중') return '18분 후';
  //   if (order.order_status === '배달중') return '12분 후';
  //   return '완료';
  // }

  // 주문 시간 형식 변환 (가정)
  const orderTime = order.created_at ? new Date(order.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : "13:30";

  return (
    <div className={`orderitem-card ${getStatusClass(order.order_status)}`} onClick={handleClick}>
      <div className="orderitem-left">
        <span className="orderitem-time">{order.order_time}</span>
      </div>
      <div className="orderitem-content">
        <div className="orderitem-header">
          <span className="orderitem-id">[{order.store} #{order.orders_idx}] {order.total_price}원</span>
          {/* <span className="orderitem-payment">결제카드</span> */}
        </div>
        <div className="orderitem-details">
          {order.order_items.split(', ').map((item, index) => {
            if (index < 2) {
              return <span key={index} className="orderitem-item">{item}</span>;
            } else if (index === 2) {
              return <span key={index} className="orderitem-item">...</span>;
            }
            return null;
          })}
        </div>
        <div className="orderitem-address">
          {order.destination}
        </div>
      </div>
      <div className="orderitem-right">
        {/* <div className="orderitem-status">
          <span className="status-label">주문표 인쇄</span>
        </div> */}
        <div className="orderitem-eta">
          {/* <span className="eta-time">{getEstimatedTime()}</span> */}
          <span className="eta-status">{order.delivery_status}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;