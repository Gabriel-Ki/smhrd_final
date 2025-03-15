import React,{ useState } from 'react';
// import '../sidebar/sidebar.css'
import '../sidebar/side.css'

const MapSidebar=({robots,selectRobot})=>{

  console.log(selectRobot);

  if (!selectRobot){
    return(
      <div className='sidbar-noselect'>
        로봇을 선택하세요
      </div>
    )
  }

  console.log(robots);
  // console.log(clickRobot);


  const getStatusClass=(status)=>{
    if(status==='이동중') return "delivery";
    if(status==='대기') return "waiting";
    return "";
  }


  const ClickMarker=selectRobot
  ? robots.filter(robot=>robot.robots_idx === selectRobot)
  : [];
  
  console.log(ClickMarker[0]);

  const menuList=ClickMarker[0]?.order_items ? ClickMarker[0].order_items.split(', ') : [];
  console.log(menuList)

  return (
    <div className="sidebar">
        <div>
          {/* 헤더 */}
          <div className='sidebar-header'>
            <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
            <h2 className="sidebar-header-text">Robot-00{ClickMarker[0].robots_idx}</h2>
          </div>
          {/* 주문 번호, 매장 */}
          <div className='sidebar-orderinfo'>
            <p>주문 번호: 10100{ClickMarker[0].orders_idx}</p> {/* api로 주문 번호 받아오기  */}
            <h3>매장 : {ClickMarker[0].store}</h3> {/* api로 매장 이름 받아오기*/}
            {/*  */}
          </div>
          {/* 배달 상태 */}
          <div className="sidebar-delivery-status">
            <div className="sidebar-status-group">
              <div className={`sidebar-status-icon ${getStatusClass(ClickMarker[0].delivery_status)}`} />
              <span className="sidebar-status-text">{ClickMarker[0].delivery_status}</span>
            </div>
          </div>
          {/* 도착지 정보 */}
          <div className='sidebar-destination'>
            <h3>도착지 : {ClickMarker[0].destination}</h3>  
            {/* <h3>도착 예상 시간: </h3> 여기는 네비게이션 api에서 뜨는 값을 출력하는건가? */}
          </div>
          <hr/>
          {/* 주문 내역 */}
          <div className="mapsidebar-order-container">
              <p className="mapsidebar-order-list">주문내역</p>
              <ul className='mapsidebar-order-list-ul'>
                {menuList.map((item, index)=>{
                  const [name, price]=item.split(' ');
                  console.log(name);
                  return(
                    <li key={index} className='mapsidebar-order-list-item'>
                      <span className='mapsidebar-order-name'> {name}</span>
                      <span className='mapsidebar-order-price'> {price}</span>
                    </li>
                  );
                })}
  
              </ul>
          </div>
          <hr />
          <div className="mapsidebar-order-total">
            <p >총액 </p> 
            <p>{ClickMarker[0].total_price}원</p>
          </div>
        </div>
    </div>
  )
}


export default MapSidebar;