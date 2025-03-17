import React from 'react'
import './Main_header.css'
const Main_dash = ({robotsStatus}) => {

  console.log("Main_header.jsx 의 robotsStatus 데이터 :", robotsStatus);

  return (
    <div className='head-container'>
        <h3 className='header-title'>Delivus</h3>
        <div className='robot-status'>
          <span className='allrobot'>전체 로봇 {robotsStatus.total}</span> {/* 여기서 숫자api로 값 가져와서 넣은 곳 */}
          <div className='fliter'>
            <span>대기 중 {robotsStatus["대기 중"]}</span>
            <span>배차 대기 중 {robotsStatus["배차 대기 중"]}</span>
            <span>가게 이동 중 {robotsStatus["가게 이동 중"]}</span>
            <span>가게 도착 {robotsStatus["가게 도착"]}</span>
            <span>목적지 이동 중 {robotsStatus["목적지 이동 중"]}</span>
            <span>목적지 도착 {robotsStatus["목적지 도착"]}</span>
            <span>회차 중 {robotsStatus["회차 중"]}</span>
          </div>
          
        </div>
        <div className='line-container'>
          <div className='custom-line'></div>
        </div>
    </div>
  )
}

export default Main_dash