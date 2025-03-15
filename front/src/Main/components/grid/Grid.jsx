import React, { useState } from 'react'
import Maincard from '../card/Main_card'
import './grid.css'

const Grid = ({gridmain}) => {

  return (
    <div className='card-grid'>
        {gridmain.map((gridmain)=>(
            <Maincard key={gridmain.robots_idx} gridmain={gridmain}/>
        ))}
    </div>
  )
}

export default Grid 