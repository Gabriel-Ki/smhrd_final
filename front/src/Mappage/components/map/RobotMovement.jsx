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
    });

    return ()=>setIsMoving(false);
    }, [clickRobot]);

    useEffect(()=>{
      if(!robotId) return ;

      const fetchRobotPosition = async ()=>{
        try{
          const response = await axios.get(`http://localhost:5000/move/${robotId}`);
          const {x,y} = response.data;

          console.log(`최신 로봇 위치 업데이트 : ${y},${x}`);
          setRobotPosition({x,y});
          console.log('setRobotPosition 호출됨!')
          console.log('setRobotPosition 값 확인!: ', setRobotPosition)
          

        }catch(error){
          console.error('로봇 위치 가져오는 중 오류 :', error);
        }
      }

      const interval=setInterval(fetchRobotPosition,3000);
      return ()=>clearInterval(interval);  
    }, [robotId]);

  // 📌 두 좌표 간 거리 계산 (Haversine 공식)
    

  return null; // UI 요소 없이 기능만 수행
};

export default RobotMovement;
