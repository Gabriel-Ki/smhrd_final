import { useState } from 'react';
// import '../sidebar/sidebar.css'
import '../sidebar/side.css'

const Sidebar=({robots,robotId})=>{

  const getStatusClass=(status)=>{
    if(status=='배송 중') return "delivery";
    if(status=='대기 중') return "waiting";
    return "";
  }

  // if(!selectRobot){
  //   return (
  //     <div className='sidebar-noSelect'>
  //       로봇을 선택하세요
  //     </div>
  //   )
  // }


  return (
    <div className="sidebar">
        <div>
          {/* 헤더 */}
          <div className='sidebar-header'>
            <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
            {/* <h2 className="sidebar-header-text">{robot.name}</h2> */}
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
              {/* <div className={`sidebar-status-icon ${getStatusClass(robot.status)}`} /> */}
              {/* <span className="sidebar-status-text">{robot.status}</span> */}
            </div>
          </div>
          {/* 도착지 정보 */}
          <div className='sidebar-destination'>
            <h3>도착지 :</h3>  {/* 여기 값 가져와서 띄우기 */}
            <h3>도착 예상 시간: </h3> {/* 여기는 네비게이션 api에서 뜨는 값을 출력하는건가? */}
          </div>
          <hr/>
          {/* 주문 내역 */}
          <div className="order-items">
              <p className="order-title">주문내역</p>
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


export default Sidebar;