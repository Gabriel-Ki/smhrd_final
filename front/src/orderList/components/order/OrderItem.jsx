import React from "react";
import '../order/orderitem.css'

const OrderItem = ({ order, onSelect }) => {
  return (
    <div 
      className="order-item"
      onClick={() => onSelect(order)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "10px",
        cursor: "pointer",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <p><strong>주문 번호:</strong> {order.order_id}</p>
      <p><strong>주문 내역:</strong> {order.items}</p>
      <p><strong>주문 주소:</strong> {order.destination}</p>
      <p><srtong>상태: </srtong> {order.status}</p>
      <p><srtong>총 금액: </srtong> {order.total_amount}</p>
    </div>
  );
};

export default OrderItem;
