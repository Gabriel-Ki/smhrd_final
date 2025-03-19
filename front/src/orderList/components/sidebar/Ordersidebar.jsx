import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../sidebar/OrderSidebar.css'

const Ordersidebar = ({orders,selectedOrder,orderStatus}) => {

    // console.log(selectedOrder);
    // console.log(orders);
    // console.log(orderStatus)

  
    const getStatusClass=(status)=>{
      if(status==='가게 도착' || status==='목적지 이동 중' || status==='목적지 도착') return "delivery";
      if(status==='배차 대기 중' || status==='대기 중' || status==='회차 중' ) return "waiting";
      return "";
    }

    if (!selectedOrder){
      return(
        <div className='sidebar'>
          <div className='sidebar-noselect'>
            주문 내역을 선택하세요
          </div>
        </div>
        
      )
    }

    const handleAcceptOrder=async ()=>{
      try{
        await axios.post('http://localhost:5000/order/accept',{
          orderId:selectedOrder,
        });
        alert('주문이 접수되었습니다');
        window.location.reload();
      }catch(err){
        console.error('주문 접수 중 오류 : ', err)
      }
    }

    if(orderStatus==='접수대기'){
      return(
        <div className='acceptorder-container'>
          <h2>주문 번호 : {selectedOrder}</h2>
          <p>주문 접수 시 로봇 배차 시작</p>
          <div className='acceptorder-btnContent'>
            <button className='order-cancelBtn'>주문 취소</button>
            <button onClick={handleAcceptOrder} className='order-acceptBtn'>주문 접수</button>
          </div>
          
        </div>
      )
    }

    if(orderStatus==='완료'){
      return(
        <div className='completeorder-container'>
          <h2>완료된 주문입니다</h2>
        </div>
      )
    }



    const handleCooking=async ()=>{
      try{
        await axios.post('http://localhost:5000/order/cooking',{
          orderId:selectedOrder,
        });
        alert('배달이 시작되었습니다');
        window.location.reload();
      }catch(err){
        console.error('로봇 픽업 중 오류 :', err)
      }
    }

    const handleCompleted=async()=>{
      try{
        await axios.post('http://localhost:5000/btn',{
          orderId:selectedOrder,
        });
        alert('배달이 완료되었습니다');
        window.location.reload();
      }catch(err){
        console.error('배달 완료 오류: ',err)
      }
    }

    



    const robotOrders = selectedOrder
    ? orders.filter(order => order.orders_idx === selectedOrder)
    : [];
    // console.log(selectedOrder);
    // console.log(orders);
    // console.log(robotOrders[0]);

    const itemListRaw = robotOrders[0]?.order_items 
    ? robotOrders[0].order_items.split(', ') 
    : [];
    const itemList=[...new Set(itemListRaw)];

    // console.log(itemList);

    const orderStatusList=["접수 대기","조리 중","배달 중","배달 완료"];

    const currentStatus=orderStatusList.indexOf(robotOrders[0]?.status || "접수 대기");


    


    





  return (
    <div className="ordersidebar">
        <div>
          {/* 헤더 */}
          <div className='ordersidebar-header'>
            <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
            <h2 className="ordersidebar-header-text">Robot-00{robotOrders[0].robots_idx}</h2>
          </div>
          {/* 주문 번호, 매장 */}
          <div className='ordersidebar-orderinfo'>
            <p>주문 번호: 10100{robotOrders[0].orders_idx}</p> {/* api로 주문 번호 받아오기  */}
            <h3>매장 : 신락원</h3> {/* api로 매장 이름 받아오기*/}
            {/*  */}
          </div>
          {/* 배달 상태 */}
          <div className="ordersidebar-delivery-status">
            <div className="ordersidebar-status-group">
              <div className={`ordersidebar-status-icon ${getStatusClass(robotOrders[0].delivery_status)}`} />
              <span className="ordersidebar-status-text">{robotOrders[0].delivery_status}</span>
            </div>
          </div>
          {/* 도착지 정보 */}
          <div className='ordersidebar-destination'>
            <h3>도착지 : {robotOrders[0].destination}</h3>  
            {/* <h3>도착 예상 시간: </h3> 여기는 네비게이션 api에서 뜨는 값을 출력하는건가? */}
          </div>
          <hr/>
          {/* 주문 내역 */}
          <div className="ordersidebar-order-container">
            <p className="ordersidebar-order-list">주문내역</p>
            <ul className="ordersidebar-order-list-ul">
            {itemList.map((item, index) => {
              const [name, price] = item.split(' '); // 메뉴 이름과 가격 분리
              console.log(name);
              console.log(price);
                return (
                  <li key={index} className="ordersidebar-order-list-item">
                    <span className="ordersidebar-order-name">{name}</span>
                    <span className="ordersidebar-order-price">{price}</span>
                  </li>
                  );
                })}
              </ul>
            </div>

          <hr />
          <div className="ordersidebar-order-total">
            <p >총액 </p> 
            <p>{robotOrders[0].total_price}원</p>
          </div>

          <div>
            {robotOrders[0].delivery_status ==='픽업 대기' ? (
              <button  onClick={handleCooking} className='order-deliverBtn'> 배달 시작</button>
            ):(
              <></>
            )}
            {orderStatus ==='배달중'?(
              <button onClick={handleCompleted} className='order-completeBtn'>배달 완료</button>
            ):(
              <></>
            )}
          </div>
        </div>
    </div>
  )

  
}



export default Ordersidebar