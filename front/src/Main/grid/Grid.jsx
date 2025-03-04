import React from 'react'
import Maincard from '../card/Main_card'
import '../grid/grid.css'

const Grid = ({robots}) => {


  return (
    <div className='card-grid'>
        {robots.map((robot)=>(
            <Maincard key={robot.id} data={robot}/>
        ))}
    </div>
  )
}

export default Grid