import React, { useState } from "react";
import OrderItem from "../order/OrderItem";

const OrderList = ({ orders, onSelectOrder }) => {
  return (
    <div className="order-container" style={{ width: "60%", padding: "10px" }}>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} onSelect={onSelectOrder} />
      ))}
    </div>
  );
};

export default OrderList;

