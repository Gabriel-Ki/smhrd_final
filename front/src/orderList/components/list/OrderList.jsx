import React, { useState } from "react";
import OrderItem from "../order/OrderItem";
import '../list/OrderList.css'

const OrderList = ({ orders, onSelectOrder }) => {

  console.log(onSelectOrder);
  console.log(orders);

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.order_status === "조리중" && b.order_status !== "조리중") return -1;
    if (a.order_status !== "조리중" && b.order_status === "조리중") return 1;
    return b.orders_idx - a.orders_idx;
  });

  return (
    <div className="orderlist-wrapper" >
      {sortedOrders.map((order) => (
        <OrderItem key={order.orders_idx}   order={order} onSelect={(id, status) => onSelectOrder(id, status)} />
      ))}
    </div>
  );
};

export default OrderList;

