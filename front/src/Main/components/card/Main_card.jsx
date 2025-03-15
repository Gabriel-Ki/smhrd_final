import React, { useEffect, useState } from 'react'
import './Main_card.css'
import axios from 'axios';

const Main_card = ({gridmain}) => {



    // const addLog=(newLog)=>{
    //     setLogs((prevLogs)=>[...prevLogs,newLog].slice(-4));
    // }

    // const [status,setStatus]=useState('작업 중');

    const statusColors={
        "대기": "gray",
        "이동중": "green",
        "회차중" : "yellow",
    };

    return (
        <div className='info-container'>
            <div className='Mainheader'>
                <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
                <h2> {gridmain.robots_idx}</h2>
                <div 
                className='status-dot' style={{backgroundColor: statusColors[gridmain.status], width: 8, height: 8, borderRadius:50 }}></div>
                <h3 className='robot-status'>{gridmain.status}</h3>
            </div>
            <div className="progress-container"> 
                <div className="progress-line">
                    <span className="start-label">출발지</span> {/* api로 값 가져와서 넣은 곳 */}
                    <span className="end-label">{gridmain.destination}</span> {/* api로 값 가져와서 넣은 곳 */}
                </div>
            </div>

            <div className="log-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{gridmain.status}</div>
                <div>{new Date(gridmain.updated_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>

        </div>
    )
}

export default Main_card