import React, { useState } from 'react'
import './Main_card.css'

const Main_card = ({robots}) => {

    const[logs,setLogs]=useState([
        {time: "12:10", message: '목적지 출발'},  // api로 값 가져와서 넣을 곳
        {time: "12:14", message: "엘레베이터 대기 중"}, // api로 값 가져와서 넣을 곳
        {time: "12:18", message: "엘레베이터 탑승"}, // api로 값 가져와서 넣을 곳
        {time: "12:20", message: "버튼 인식"} // api로 값 가져와서 넣을 곳 
    ])

    const addLog=(newLog)=>{
        setLogs((prevLogs)=>[...prevLogs,newLog].slice(-4));
    }

    const [status,setStatus]=useState('작업 중');

    const statusColors={
        "대기 중": "gray",
        "작업 중": "green",
        "에러" : "red",
    };

    return (
        <div className='info-container'>
            <div className='Mainheader'>
                <img src="./img/robot.png" alt="robot" width='30px' height='30px'/>
                <h2> 프로그램명-</h2> {/* api로 값 가져와서 넣은 곳 */}
                <div 
                className='status-dot' style={{backgroundColor: statusColors[status], width: 8, height: 8, borderRadius:50 }}></div>
                <h3 className='robot-status'>{status}</h3>
            </div>
            <div className="progress-container"> 
                <div className="progress-line">
                    <span className="start-label">출발지</span> {/* api로 값 가져와서 넣은 곳 */}
                    <h3 className="progress-text">진행도 N%</h3> {/* api로 값 가져와서 넣은 곳 */}
                    <span className="end-label">목적지</span> {/* api로 값 가져와서 넣은 곳 */}
                </div>
            </div>

            <div className='log-container'>
                {logs.map((log, index)=>(
                    <div key={index} className='log-item'>
                        <span className='log-message'>{log.message}</span>
                        <span className='log-time'>{log.time}</span>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Main_card