import React, { useEffect, useState } from 'react'
import './Main_card.css'
import axios from 'axios';

const Main_card = ({robot}) => {

    const [logs,setLogs]=useState([]);


    // console.log(robot)

    useEffect(()=>{
        const axiosCard=async ()=>{
            try{
                const response=await axios.get('http://localhost:5000/log');
                setLogs(response.data);
            }catch(err){
                console.error('api 통신 오류:', err)
            }
        }
        axiosCard();

        const interlog=setInterval(axiosCard,10000);

        return ()=>clearInterval(interlog);
    },[]);

    const filteredLogs=logs.filter(log=>log.robot_id === robot.robot_id)
    console.log(filteredLogs)

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

                {filteredLogs?.length > 0 ? (
                    filteredLogs.map((log, index) => (
                        <div key={index} className='log-item'>
                            <span className='log-message'>{log.log_m}</span>
                            <span className='log-time'>{log.log_t}</span>
                        </div>
                    ))
                ) : (
                    <p>로그 데이터 없음</p> // 데이터가 없을 때 기본 메시지 표시
                )} 
            </div>

        </div>
    )
}

export default Main_card