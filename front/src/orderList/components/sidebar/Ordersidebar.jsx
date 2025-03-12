import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Ordersidebar = ({orders,onClick}) => {

  const [orderSide,setOrderSide]=useState([]);

  

  useEffect(()=>{
    const axiosOrderSide=async ()=>{
      try{
        const response= await axios.get('http://localhost:5000/order/sidebar'); // 경로 수정하고 로봇 6개의 정보를 여기로 출력
        setOrderSide(response.data);
        
      } catch(error){
        console.error('로봇 정보를 가져오는 중 오류 :', error);
      } 
    }
    axiosOrderSide();
    
    const interorderSide=setInterval(axiosOrderSide,10000); // 10초 마다 업데이트 하겠다

    return ()=>clearInterval(interorderSide);

    },[]);

    console.log(orderSide);
    console.log(orders);

    const getStatusClass=(status)=>{
      if(status==='이동중') return "delivery";
      if(status==='대기') return "waiting";
      return "";
    }

    if (!onClick){
      return(
        <div className='sidebar-noselect'>
          내역을 선택하세요
        </div>
      )
    }







  return (
    <div className="sidebar">
        <div>
          {/* 헤더 */}
          <div className='sidebar-header'>
            <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
            <h2 className="sidebar-header-text">{orders.robot_id}</h2>
          </div>
          {/* 주문 번호, 매장 */}
          <div className='sidebar-orderinfo'>
            <p>주문 번호: {}</p> {/* api로 주문 번호 받아오기  */}
            <h3>매장 : {}</h3> {/* api로 매장 이름 받아오기*/}
            {/*  */}
          </div>
          {/* 배달 상태 */}
          <div className="sidebar-delivery-status">
            <div className="sidebar-status-group">
              <div className={`sidebar-status-icon ${getStatusClass(orderSide.status)}`} />
              <span className="sidebar-status-text">{orderSide.status}</span>
            </div>
          </div>
          {/* 도착지 정보 */}
          <div className='sidebar-destination'>
            <h3>도착지 : {orderSide.destination}</h3>  
            <h3>도착 예상 시간: </h3> {/* 여기는 네비게이션 api에서 뜨는 값을 출력하는건가? */}
          </div>
          <hr/>
          {/* 주문 내역 */}
          <div className="order-container">
              <p className="order-list">주문내역</p>
              <ul>
                {/* {robot.items?.map((item, index) => (
                  
                  <>
                    <li key={index}>{item.name}</li>
                    <li>{item.price}</li>
                  </>
                ))} */}
  
              </ul>
          </div>
          <hr />
          <div className="order-total">
            <p >총액 </p> 
            {/* <p>{selectRobot.totalPrice}원</p> */}
          </div>
        </div>
    </div>
  )
}

export default Ordersidebar