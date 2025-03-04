import React from 'react'
import './Main_header.css'
const Main_dash = () => {
  return (
    <div className='head-container'>
        <h3 className='header-title'>팀장선</h3>
        <div className='robot-status'>
          <span className='allrobot'>전체 로봇 8</span> 
          <div className='fliter'>
            <span>수행 중 4</span>
            <span>대기 중 1</span>
            <span>충전 중 1</span>
            <span className='error'>에러 1</span>
            <span className='emergency-stop'>비상 정지 1</span>
          </div>
          
        </div>
        <div className='line-container'>
          <div className='custom-line'></div>
        </div>
    </div>
  )
}

export default Main_dash