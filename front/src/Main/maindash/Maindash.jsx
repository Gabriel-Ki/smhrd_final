import React, { useEffect, useState } from 'react'
import Grid from '../components/grid/Grid'
import Mainheader from '../components/header/Main_header'
import axios from 'axios';


const Maindash = () => {

  const [gridmainStatus, setGridMainStatus] = useState([]);
  const [robotsStatus,setRobotsStatus]=useState([]);

  useEffect(()=>{
    const axiosMain = async ()=>{
      try {
        const response = await axios.get('http://localhost:5000/grid_maincard');
        setGridMainStatus(response.data.gridmain);

        const response2 = await axios.get('http://localhost:5000/robots/status');
        setRobotsStatus(response2.data);
        
      } catch (error) {
        console.error('API 통신 오류:', error);
      }
    };

    axiosMain();

  // const interterm=setInterval(axiosMain,30000);

  // return ()=>clearInterval(interterm);
  },[]);

  return (
    <div>
        <Mainheader robotsStatus={robotsStatus}/>
        <Grid gridmain={gridmainStatus}/>
    </div>
  )
}

export default Maindash