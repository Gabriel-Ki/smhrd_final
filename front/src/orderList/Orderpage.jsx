import React, { useEffect, useState } from 'react'
import axios from 'axios';
import OrderSide from './components/sidebar/Ordersidebar'
import OrderList from './components/list/OrderList'
import './orderpage.css'

const Orderpage = () => {

  const [orders,setOrders]=useState([]);
  const [selectedOrder,setSelectedOrder]=useState();

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

  const onOrderClick=(order)=>{
    console.log("클릭된 주문", order)
    setSelectedOrder(order);
  }

  // console.log(selectedOrder);
  // useEffect(()=>{
  //   if(selectOrder){
  //     const orderclick=orders.find(order=>order.id===selectOrder);
  //     setTouch(orderclick);
  //   }
  // },[selectOrder]);


    
  return (
    <div className='orderpage'>
      <div className='orderpage-header'> 
        팀장선
      </div>
      <div className='orderpage-container'>

      
      <div className='orderpage-box'>
        <div  className='orderpage-list'>
        <OrderList orders={orders} onSelectOrder={onOrderClick}/>
        </div>
        <div  className='orderpage-sidebar'>
        <OrderSide selectedOrder={selectedOrder} orders={orders}/>
        </div>
        </div>
        
      </div>
      
      
    </div>
  )
}

export default Orderpage