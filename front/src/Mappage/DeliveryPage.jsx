import React, { useEffect, useState } from 'react'
import KakaoMap from './components/map/Kakaomap';
import Sidebar from './components/sidebar/Sidebar';
import '../Mappage/Deliverypage.css';
import axios from 'axios';


const DeliveryPage = () => {

  const [robots,setRobots]=useState([]) // 로봇 정보 담고
  const [selectRobot,setSelectRobot]=useState(null); // 지도에서 클릭한 로봇의 id 

  const [sideRobots,setSideRobots]=useState([]); //sidebar에 넘길 값들만 뽑은
  const [mapRobots,setMapRobots]=useState([]); // map에 넘길 값들만 뽑은 

  useEffect(()=>{
    const axiosRobot=async ()=>{
      try{
        const response= await axios.get('/robot'); // 경로 수정하고 로봇 6개의 정보를 여기로 출력
        setRobots(response.data);
      } catch(error){
        console.error('로봇 정보를 가져오는 중 오류 :', error);
      } 
    }
    axiosRobot();

    const intervaild=setInterval(axiosRobot,10000); // 10초 마다 업데이트 하겠다

    return ()=>clearInterval(intervaild);

    },[]);


    const onMarkerClick=(robot)=>{
      setSelectRobot(robot);
    }





  return (
    <div className='delivery-page'>
      <div className='delivery-header'>팀장선</div>
      <div className='delivery-container'>
        {/* 지도와 사이드바 */}
        <div className='delivery-box'>
          {/* 지도 */}
          <div className='delivery-map'>
            <KakaoMap robots={mapRobots} onMarkerSelect={onMarkerClick} />
          </div>
          {/* 사이드바 */}
          <div className='delivery-sidebar'>
            <Sidebar robots={sideRobots} robotId={selectRobot}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPage;