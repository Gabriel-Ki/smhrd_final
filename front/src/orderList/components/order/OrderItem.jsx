import React from "react";
import '../order/orderitem.css'

const OrderItem = ({ order, onSelect }) => {


  const handleClick=()=>{
    onSelect(order.robots_idx);
  }

  return (
    <div className="orderitem-card" onClick={handleClick}>
      <span className="orderitem-time">{order.order_time}</span>
      <span className="orderitem-info">주문 번호: {order.orders_idx}</span>
      <span className="orderitem-info">주문 내역: {order.order_items}</span>
      <span className="orderitem-info">주문 주소: {order.destination}</span>
      {/* <span className="orderitem-info">상태:  {order.status}</span> */}
      <span className="orderitem-info">총 금액:  {order.total_price}</span>
    </div>
  );
};

export default OrderItem;
