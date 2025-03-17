import React, { useState } from 'react'
import Maincard from '../card/Main_card'
import './grid.css'

const Grid = ({gridmain}) => {
  console.log("GRID.jsx 의 gridmain 데이터 :", gridmain);

  const groupedData = gridmain.reduce((acc, cur) => {
    if (!acc[cur.robots_idx]) {
        acc[cur.robots_idx] = {
            robots_idx: cur.robots_idx,
            destination: cur.destination,
            logs: []
        };
    }
    acc[cur.robots_idx].logs.push({
        status: cur.status,
        updated_at: new Date(cur.updated_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    });
    return acc;
}, {});

Object.keys(groupedData).forEach(robotID =>{
    groupedData[robotID].logs = groupedData[robotID].logs
    .sort((a,b)=> new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0,3);
});

console.log("groupedData:", groupedData);

  return (
    <div className='card-grid'>
        {Object.values(groupedData).map((robot) => (
          <Maincard key={`robot-${robot.robots_idx}`} gridmain={robot}/>
        ))}
    </div>
  )
}

export default Grid 