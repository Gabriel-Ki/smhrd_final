import React, { useState } from "react";
import OrderItem from "../order/OrderItem";
import '../list/OrderList.css'

const OrderList = ({ orders, onSelectOrder }) => {

  console.log(onSelectOrder);
  console.log(orders);

  return (
    <div className="orderlist-wrapper" >
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} onSelect={onSelectOrder} />
      ))}
    </div>
  );
};

export default OrderList;

