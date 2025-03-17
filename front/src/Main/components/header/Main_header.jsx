import React from 'react'
import './Main_header.css'
import { useNavigate } from 'react-router-dom';
const Main_dash = ({robotsStatus}) => {
  // console.log("Main_header.jsx 의 robotsStatus 데이터 :", robotsStatus);

  

  const getStatusClass = (status) => {
    switch(status){
      case "대기 중": return "status-waiting";
      case "가게 이동 중": return "status-moving";
      case "픽업 대기": return "status-pickup";
      case "목적지 이동 중": return "status-delivery";
      case "배달 완료": return "status-complete";
      default : return "Nothing";
    }
  };


  return (
    <div className='head-container'>
      
        <div className='robot-status'>
          <span className='allrobot'>전체 로봇 {robotsStatus.total}</span> {/* 여기서 숫자api로 값 가져와서 넣은 곳 */}
          <div className='fliter'>
          <span className={getStatusClass("대기 중")}>대기 중 {robotsStatus["대기 중"] ?? 0}</span>
            <span className={getStatusClass("가게 이동 중")}>가게 이동 중 {robotsStatus["가게 이동 중"] ?? 0}</span>
            <span className={getStatusClass("픽업 대기")}>픽업 대기 {robotsStatus["픽업 대기"] ?? 0}</span>
            <span className={getStatusClass("목적지 이동 중")}>목적지 이동 중 {robotsStatus["목적지 이동 중"] ?? 0}</span>
            <span className={getStatusClass("배달 완료")}>배달 완료 {robotsStatus["배달 완료"] ?? 0}</span>
          </div>
          
        </div>
        <div className='line-container'>
          <div className='custom-line'></div>
        </div>
    </div>
  )
}

export default Main_dash