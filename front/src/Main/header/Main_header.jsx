import React from 'react'
import './Main_header.css'
const Main_dash = () => {
  return (
    <div className='head-container'>
        <h3 className='header-title'>팀장선</h3>
        <div className='robot-status'>
          <span className='allrobot'>전체 로봇 8</span> {/* 여기서 숫자api로 값 가져와서 넣은 곳 */}
          <div className='fliter'>
            <span>수행 중 4</span>{/*여기서 숫자 api로 값 가져와서 넣은 곳 */}
            <span>대기 중 1</span>{/* 여기서 숫자api로 값 가져와서 넣은 곳 */}
            <span>충전 중 1</span>{/* 여기서 숫자api로 값 가져와서 넣은 곳 */}
            <span className='error'>에러 1</span>{/* 여기서 숫자api로 값 가져와서 넣은 곳 */}
            <span className='emergency-stop'>비상 정지 1</span>{/* 여기서 숫자api로 값 가져와서 넣은 곳 */} 
          </div>
          
        </div>
        <div className='line-container'>
          <div className='custom-line'></div>
        </div>
    </div>
  )
}

export default Main_dash