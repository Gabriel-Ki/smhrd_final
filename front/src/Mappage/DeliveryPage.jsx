import React, { useEffect, useState } from 'react'
import KakaoMap from './components/map/Kakaomap';
import Sidebar from './components/sidebar/Sidebar';
import '../Mappage/Deliverypage.css';
import axios from 'axios';


const DeliveryPage = () => {

  const [robots,setRobots]=useState([]) // 로봇 정보 담고
  const [selectRobot,setSelectRobot]=useState(null); // 지도에서 클릭한 로봇의 id
  const [clickRobot,setClickRobot]=useState(); 

  const [sideRobots,setSideRobots]=useState([]); //sidebar에 넘길 값들만 뽑은
  const [mapRobots,setMapRobots]=useState([]); // map에 넘길 값들만 뽑은 

  useEffect(()=>{
    const axiosRobot=async ()=>{
      try{
        const response= await axios.get('http://localhost:5000/robot'); // 경로 수정하고 로봇 6개의 정보를 여기로 출력
        setRobots(response.data);
        // console.log(response.data);
        // console.log(response);
        // console.log(robots);
        
      } catch(error){
        console.error('로봇 정보를 가져오는 중 오류 :', error);
      } 
    }
    axiosRobot();
    
    const intervaild=setInterval(axiosRobot,10000); // 10초 마다 업데이트 하겠다

    return ()=>clearInterval(intervaild);

    },[]);


    const onMarkerClick=(robot)=>{
      console.log(robot, '마커 클릭');
      setSelectRobot(robot);
      
    }

    useEffect(()=>{
      if(selectRobot){
        console.log('선택된 로봇', selectRobot);
        // setClickRobot(robots.find(robot=>robot.robot_name ===selectRobot));
        const clicked=robots.find(robot=>robot.robot_id ===selectRobot);
        setClickRobot(clicked);
      }
    },[selectRobot]);

    // console.log('deliverypage',onMarkerClick);

    
    // console.log(clickRobot);
    


  return (
    <div className='delivery-page'>
      <div className='delivery-header'>팀장선</div>
      <div className='delivery-container'>
        {/* 지도와 사이드바 */}
        <div className='delivery-box'>
          {/* 지도 */}
          <div className='delivery-map'>
            <KakaoMap robots={robots} onMarkerClick={onMarkerClick} clickRobot={clickRobot}/>
          </div>
          {/* 사이드바 */}
          <div className='delivery-sidebar'>
            <Sidebar clickRobot={clickRobot}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPage;