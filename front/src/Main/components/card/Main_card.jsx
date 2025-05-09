import React, { useEffect, useState } from 'react'
import './Main_card.css'
import axios from 'axios';

const Main_card = ({gridmain}) => {

    const statusColors = {
        "대기 중": "red",
        "가게 이동 중": "orange",
        "픽업 대기": "green",
        "목적지 이동 중": "blue"
    };

    return (
        <div className='info-container'>
                <div className="robot-card">
                    <div className='Mainheader'>
                        <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
                        <h2> {gridmain.robots_idx}</h2>
                        <div 
                        className='status-dot' 
                        style={{
                            backgroundColor: statusColors[gridmain.logs[0]?.status] || "gray",
                            width: 8, 
                            height: 8, 
                            borderRadius: "50%"
                        }}></div>
                        <h3 className='robot-status'>{gridmain.logs[0]?.status}</h3>
                    </div>
                    
                    <div className="progress-container">
                        <div className = "progress-line">
                            <span className="start-label">출발지</span>
                            <span className="end-label">{gridmain.destination}</span>
                        </div>
                    </div>
                    
                    <div className = "log-container">
                        {gridmain.logs.map((log,index) => (
                            <div className='log-list' key={index}>
                                <span className='log-status'>{log.status}</span>
                                <span className='log-time'>{log.updated_at}</span>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    )
}

export default Main_card