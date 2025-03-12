import React, { useEffect, useState } from 'react'
import axios from 'axios';
import OrderSide from './components/sidebar/Ordersidebar'
import OrderList from './components/list/OrderList'

const Orderpage = () => {

  const [orders,setOrders]=useState([]);

  useEffect(()=>{
    const axiosOrder=async ()=>{
      try{
        const response= await axios.get('http://localhost:5000/order');
        setOrders(response.data);
      }catch(err){
        console.error('주문 정보 가져오는 중 오류:', err);
      }
    }
    axiosOrder();

    const interOrder=setInterval(axiosOrder,10000);

    return ()=>clearInterval(interOrder);
  },[])

  console.log(orders);

  const [selectOrder,setSelectOrder]=useState(null);

  const onOrderClick=(order)=>{
    setSelectOrder(order)
  }


    
  return (
    <div>
      <OrderList orders={orders} onSelectOrder={setSelectOrder}/>
      <OrderSide onClick={setSelectOrder} orders={orders}/>
      
    </div>
  )
}

export default Orderpage