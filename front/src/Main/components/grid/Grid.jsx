import React, { useState } from 'react'
import Maincard from '../card/Main_card'
import './grid.css'

const Grid = ({mainrobots}) => {

  // const [robots, setRobots]=useState

  console.log(mainrobots);


  return (
    <div className='card-grid'>
        {mainrobots.map((mainrobot)=>(
            <Maincard key={mainrobot.id} robot={mainrobot}/>
        ))}
    </div>
  )
}

export default Grid 