import React, { useState } from 'react'
import '../card/Main_card.css'

const Main_card = () => {

    const [status,setStatus]=useState('작업 중');

    const statusColors={
        "대기 중": "gray",
        "작업 중": "green",
        "에러" : "red",
    };

    return (
        <div className='alal'>
            <div className='Mainheader'>
                <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
                <h2> 프로그램명- 숫자</h2>
                <div 
                className='status-dot' style={{backgroundColor: statusColors[status], width: 8, height: 8, borderRadius:50 }}></div>
                <h4 className='robot-status'>{status}</h4>
            </div>
            <div className="progress-container"> 
                <div className="progress-line">
                    <span className="start-label">출발지</span>
                    <h3 className="progress-text">진행도 N%</h3>
                    <span className="end-label">목적지</span>
                </div>
            </div>

        </div>
    )
}

export default Main_card