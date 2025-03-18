import React, { useEffect, useState } from 'react'
import KakaoMap from './components/map/Kakaomap';
import MapSidebar from './components/sidebar/MapSidebar';
import '../Mappage/Deliverypage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../header.css'
// import '../layout/Layout.css'

const DeliveryPage = () => {

  const navigate = useNavigate();
  const [robots,setRobots]=useState([]) // 로봇 정보 담고
  const [selectRobot,setSelectRobot]=useState(null); // 지도에서 클릭한 로봇의 id
  // const [clickRobot,setClickRobot]=useState(); 

  // const [sideRobots,setSideRobots]=useState([]); //sidebar에 넘길 값들만 뽑은
  // const [mapRobots,setMapRobots]=useState([]); // map에 넘길 값들만 뽑은 

  useEffect(()=>{
    const axiosRobot=async ()=>{
      try{
        const response= await axios.get('http://localhost:5000/robot'); // 경로 수정하고 로봇 6개의 정보를 여기로 출력
        setRobots(response.data);
        
      } catch(error){
        console.error('로봇 정보를 가져오는 중 오류 :', error);
      } 
    }
    axiosRobot();
    
    const intervaild=setInterval(axiosRobot,180000); // 10초 마다 업데이트 하겠다

    return ()=>clearInterval(intervaild);

    },[]);

    // console.log(robots);


    const onMarkerClick=(robot)=>{

      if (selectRobot===robot){
        setSelectRobot(null)
      }else{
        setSelectRobot(robot);
      }
      // console.log(robot, '마커 클릭');
      
      
    }

    const NaviRobot=robots.find(robot=> robot.robots_idx === selectRobot)
    // console.log(NaviRobot)

  

    // console.log('deliverypage',onMarkerClick);

    
    // console.log(clickRobot);
    
    // console.log(selectRobot);


  return (
    <div className='delivery-page'>
      <div className='common-header'>
      <span className='header-title' >Delivus</span>
        <div className='common-header-buttons'>
          <button onClick={() => navigate('/maindash')}>대시보드</button>
          <button onClick={() => navigate('/')}>주문 내역</button>
        </div>
      </div>
      
      <div className='delivery-container'>
        {/* 지도와 사이드바 */}
        <div className='delivery-box'>
          {/* 지도 */}
          <div className='delivery-map'>
            <KakaoMap robots={robots} onMarkerClick={onMarkerClick} clickRobot={NaviRobot}/>
          </div>
          {/* 사이드바 */}
          <div className='delivery-sidebar'>
            <MapSidebar selectRobot={selectRobot} robots={robots}/>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DeliveryPage;