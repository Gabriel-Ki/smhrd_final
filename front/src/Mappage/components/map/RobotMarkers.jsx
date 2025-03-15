import { useEffect, useRef } from "react";

function RobotMarkers({ map, onMarkerClick, robots }) {
  const robotMarkersRef = useRef([]);

  useEffect(() => {
    if (!map || !robots) return;

    console.log(robots);

    // 기존 마커 제거
    robotMarkersRef.current.forEach(marker => marker.setMap(null));
    robotMarkersRef.current = [];

    // 새로운 로봇 마커 생성
    robots.forEach(robot => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(robot.robot_x, robot.robot_y),
        image: new window.kakao.maps.MarkerImage(
          "/img/robot1.png",
          new window.kakao.maps.Size(40, 40)
        ),
        map: map,
        // zIndex:9999
      });
      console.log(robot);


      // 마커 클릭 이벤트 (필요하다면)
      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, "click", () => {
          onMarkerClick(robot.robots_idx);
          // console.log(robot)
        });
      }

      robotMarkersRef.current.push(marker);
    });

    console.log("🚀 로봇 마커 생성 완료:", robotMarkersRef.current.length);

    // cleanup 함수
    return () => {
      robotMarkersRef.current.forEach(marker => marker.setMap(null));
      robotMarkersRef.current = [];
    };
  }, [map, robots, onMarkerClick]);

  return null; // 화면에 직접 표시할 요소는 없고, 마커만 지도 위에 띄움
}

export default RobotMarkers;
