import React, { useEffect, useState } from 'react'
import './Main_card.css'
import axios from 'axios';

const Main_card = ({gridmain}) => {

    const statusColors={
        "대기": "gray",
        "이동중": "green",
        "회차중" : "yellow",
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
                            backgroundColor: statusColors[gridmain.logs[0]?.status] ||"gray", 
                            width: 8, 
                            height: 8, 
                            borderRadius:50 
                        }}>
                        </div>
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
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>{log.status}</div>
                                <div>{log.updated_at}</div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    )
}

export default Main_card