import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import '../sidebar/OrderSidebar.css'
// import '../sidebar/OrderSide.css'
import '../sidebar/sidebarex.css'

const Ordersidebar = ({orders,selectedOrder}) => {

  // const [orderSide,setOrderSide]=useState([]);

  

  // useEffect(()=>{
  //   const axiosOrderSide=async ()=>{
  //     try{
  //       const response= await axios.get('http://localhost:5000/order/sidebar'); // 경로 수정하고 로봇 6개의 정보를 여기로 출력
  //       setOrderSide(response.data);
        
  //     } catch(error){
  //       console.error('로봇 정보를 가져오는 중 오류 :', error);
  //     } 
  //   }
  //   axiosOrderSide();
    
  //   const interorderSide=setInterval(axiosOrderSide,10000); // 10초 마다 업데이트 하겠다

  //   return ()=>clearInterval(interorderSide);

  //   },[]);

    console.log(selectedOrder);
    console.log(orders);

    const getStatusClass=(status)=>{
      if(status==='이동중') return "delivery";
      if(status==='대기') return "waiting";
      return "";
    }

    if (!selectedOrder){
      return(
        <div className='sidebar'>
          <div className='sidebar-noselect'>
            내역을 선택하세요
          </div>
        </div>
        
      )
    }

    const robotOrders = selectedOrder
    ? orders.filter(order => order.robots_idx === selectedOrder)
    : [];

    console.log(robotOrders[0]);

    const itemList = robotOrders[0]?.order_items ? robotOrders[0].order_items.split(', ') : [];

    console.log(itemList);

    const orderStatsusList=["주문 대기","조리 중","배달 중","배달 완료"];

    const currentStatus=orderStatsusList.indexOf(robotOrders[0]?.status || "주문 대기");






  return (
    <div className="ordersidebar">
        <div>
          {/* 헤더 */}
          <div className='ordersidebar-header'>
            <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
            <h2 className="ordersidebar-header-text">Robot-00{selectedOrder}</h2>
          </div>
          {/* 주문 번호, 매장 */}
          <div className='ordersidebar-orderinfo'>
            <p>주문 번호: {robotOrders[0].orders_idx}</p> {/* api로 주문 번호 받아오기  */}
            <h3>매장 : 신락원</h3> {/* api로 매장 이름 받아오기*/}
            {/*  */}
          </div>
          {/* 배달 상태 */}
          <div className="ordersidebar-delivery-status">
            <div className="ordersidebar-status-group">
              <div className={`ordersidebar-status-icon ${getStatusClass(robotOrders[0].delivery_statusstatus)}`} />
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
            <p>{robotOrders[0].total_amount}원</p>
          </div>
        </div>

        {/* <div className="ordersidebar-order-status-container">
          {orderStatsusList.map((status, index) => (
            <div key={index} className="ordersidebar-order-status-item">
              <span className={`orderstatus-dot ${index === currentStatus ? 'orderactive-status' : ''}`} />
              <span className="ordersidebar-status-text">{status}</span>
              <div className="ordersidebar-status-buttons">
                {index <= currentStatus ? (
                  <button className="ordersidebar-status-approve-btn">✅</button>
                ) : (
                  <button className="ordersidebar-status-disabled-btn" disabled>
                    ✅
                  </button>
                )}
                <button className="ordersidebar-status-cancel-btn">🔄</button>
              </div>
            </div>
          ))}
        </div> */}
    </div>
  )
}

export default Ordersidebar