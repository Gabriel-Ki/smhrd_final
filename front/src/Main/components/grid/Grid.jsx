import React, { useState } from 'react'
import Maincard from '../card/Main_card'
import './grid.css'

const Grid = ({robots}) => {

  // const [robots, setRobots]=useState


  return (
    <div className='card-grid'>
        {robots.map((robot)=>(
            <Maincard key={robot.id} data={robot} robot={robot}/>
        ))}
    </div>
  )
}

export default Grid 