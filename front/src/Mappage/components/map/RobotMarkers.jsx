import { useEffect } from "react";

const RobotMarkers = ({ map, robots, onMarkerClick}) => {

  // console.log(onMarkerClick);
  useEffect(() => {
    if (!map || !robots) return;

    const imageSrc="/img/robot1.png"

    const imageSize=new window.kakao.maps.Size(30,30)

    const imageOption={offset : new window.kakao.maps.Point(25,25)};

    const markerImage=new window.kakao.maps.MarkerImage(imageSrc, imageSize,imageOption);



    // console.log(robots);
    


    robots.forEach(robot => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(robot.latitude, robot.longitude),
        map: map,
        // image: markerImage
      });
      
      



      // 마커 클릭 이벤트 추가
      window.kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick(robot.robot_id);
      });
    });
  }, [map, robots]);

  return null;
};

export default RobotMarkers;
  