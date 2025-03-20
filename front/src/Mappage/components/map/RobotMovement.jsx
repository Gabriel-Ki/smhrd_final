import axios from "axios";
import { useEffect, useState } from "react";

const RobotMovement = ({ setRobotPosition, clickRobot }) => {
  const [isMoving,setIsMoving]=useState(false);
  const [robotId, setRobotId]=useState(null)

  // ✅ 미리 지정한 로봇 이동 경로
  
  // console.log(clickRobot);


  useEffect(()=>{
    if (!clickRobot) return;
    setRobotId(clickRobot.robots_idx);
  }, [clickRobot])


  

  // ✅ 5초마다 로봇 이동
  
  useEffect(() => {
    if(!clickRobot || isMoving || clickRobot.delivery_status !== '가게 이동 중') return;

    setIsMoving(true); // 이동 상태 활성화

    axios.post("http://localhost:5000/move",{
      robotId : clickRobot.robots_idx,
      storeX : clickRobot.store_x,
      storeY : clickRobot.store_y
    })
    .then(response =>{
      console.log(response.data.message);
      setIsMoving(true);
    })
    .catch(error =>{
      console.error('로봇 이동 요청 실패 :', error)
      setIsMoving(false);
    });

    return ()=>setIsMoving(false);
    }, [clickRobot, isMoving]);

    useEffect(()=>{
      if(!robotId) return ;
      
      let isFetching=false

      const fetchRobotPosition = async ()=>{
        if(isFetching) return;

        isFetching=true

        try{
          const response = await axios.get(`http://localhost:5000/move/${robotId}`);
          const {x,y} = response.data;

          console.log(`최신 로봇 위치 업데이트 : ${y},${x}`);
          setRobotPosition(prevPositon=>{
            if(prevPositon.x !==x || prevPositon.y !==y ){
              console.log(`위치 변경 감지 : (${prevPositon.x},${prevPositon.y})->(${x},${y})`);
              return {x,y};
            }
            return prevPositon;
          })
          

        }catch(error){
          console.error('로봇 위치 가져오는 중 오류 :', error);
        }finally{
          isFetching=false;
        }
      }

      // 초기 위치 즉시 가져오기
      // fetchRobotPosition();

      const interval=setInterval(fetchRobotPosition,2000);
      return ()=>clearInterval(interval);  
    }, [robotId,setRobotPosition]);

  // 📌 두 좌표 간 거리 계산 (Haversine 공식)
    

  return null; // UI 요소 없이 기능만 수행
};

export default RobotMovement;
