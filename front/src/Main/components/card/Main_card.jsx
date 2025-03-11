import React, { useState } from 'react'
import './Main_card.css'

const Main_card = ({robot}) => {
 

    console.log(robot)

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
                <h2> {robot.robot_id}</h2>
                <div 
                className='status-dot' style={{backgroundColor: statusColors[robot.status], width: 8, height: 8, borderRadius:50 }}></div>
                <h3 className='robot-status'>{robot.status}</h3>
            </div>
            <div className="progress-container"> 
                <div className="progress-line">
                    <span className="start-label">출발지</span> {/* api로 값 가져와서 넣은 곳 */}
                    <span className="end-label">{robot.destination}</span> {/* api로 값 가져와서 넣은 곳 */}
                </div>
            </div>

            <div className='log-container'>
                {/* {logs.map((log, index)=>(
                    <div key={index} className='log-item'>
                        <span className='log-message'>{log.message}</span>
                        <span className='log-time'>{log.time}</span>
                    </div>
                ))} */}
                <div className='log-item'>
                    <span className='log-message'>{robot.log_m}</span>
                    <span className='log-time'>{robot.log_t}</span>
                </div>
                
            </div>

        </div>
    )
}

export default Main_card