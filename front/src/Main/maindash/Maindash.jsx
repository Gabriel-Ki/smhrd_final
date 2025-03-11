import React, { useEffect, useState } from 'react'
import Grid from '../components/grid/Grid'
import Mainheader from '../components/header/Main_header'
import axios from 'axios';


const Maindash = () => {

  const [mainRobots,setMainRobots]=useState([]);

  useEffect(()=>{
    const axiosMain=async ()=>{
      try{
        const response=await axios.get('http://localhost:5000/dashboard');
        setMainRobots(response.data);
      }catch(error){
        console.error('api 통신 오류:',error);
      }
    }
    axiosMain();

    const interterm=setInterval(axiosMain,10000);

    return ()=>clearInterval(interterm);
  },[]);

    console.log(mainRobots);




  return (
    <div>
        <Mainheader/>
        <Grid mainrobots={mainRobots}/>
    </div>
  )
}

export default Maindash