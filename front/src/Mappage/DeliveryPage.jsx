import React, { useEffect, useState } from 'react'
import KakaoMap from './components/map/Kakaomap';
import MapSidebar from './components/sidebar/MapSidebar';
import '../Mappage/Deliverypage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../header.css'

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [robots, setRobots] = useState([]); // 로봇 정보 담기
  const [selectRobot, setSelectRobot] = useState(null); // 지도에서 클릭한 로봇의 id

  // 로봇 데이터 가져오기
  useEffect(() => {
    const axiosRobot = async () => {
      try {
        const response = await axios.get('http://localhost:5000/robot');
        setRobots(response.data);
      } catch (error) {
        console.error('로봇 정보를 가져오는 중 오류:', error);
      }
    }
    axiosRobot();
    
    // 3분(180000ms)마다 로봇 정보 업데이트
    const intervalId = setInterval(axiosRobot, 180000);
    
    return () => clearInterval(intervalId);
  }, []);

  // 마커 클릭 핸들러
  const onMarkerClick = (robot) => {
    if (selectRobot === robot) {
      setSelectRobot(null);
    } else {
      setSelectRobot(robot);
    }
  };

  // 선택된 로봇 객체 가져오기
  const selectedRobotObject = robots.find(robot => robot.robots_idx === selectRobot);

  return (
    <div className='delivery-page'>
      <div className='common-header'>
        <span className='header-title'>Delivus</span>
        <div className='common-header-buttons'>
          <button onClick={() => navigate('/maindash')}>대시보드</button>
          <button onClick={() => navigate('/')}>주문 내역</button>
        </div>
      </div>
      
      <div className='delivery-container'>
        <div className='delivery-box'>
          <div className='delivery-map'>
            <KakaoMap 
              robots={robots} 
              onMarkerClick={onMarkerClick} 
              clickRobot={selectedRobotObject} 
            />
          </div>
          <div className='delivery-sidebar'>
            <MapSidebar selectRobot={selectRobot} robots={robots} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPage;