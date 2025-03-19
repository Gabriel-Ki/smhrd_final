import { useEffect, useRef } from "react";

function RobotMarkers({ map, onMarkerClick, robots, clickRobot , robotPosition}) {
  const robotMarkersRef = useRef([]);

  useEffect(() => {
    if (!map || !robots) return;

    // 기존 마커 제거
    robotMarkersRef.current.forEach(marker => marker.setMap(null));
    robotMarkersRef.current = [];

    // 새로운 로봇 마커 생성
    robots.forEach((robot) => {
      const position =(robot.robots_idx === parseInt(clickRobot) && robotPosition) 
        ? new window.kakao.maps.LatLng(robotPosition.x, robotPosition.y) 
        : new window.kakao.maps.LatLng(robot.robot_x, robot.robot_y);

      // 마커 이미지 설정
      const markerImage = new window.kakao.maps.MarkerImage(
        "/img/robot1.png",
        new window.kakao.maps.Size(40, 40)
      );

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
        // clickRobot가 null이면 모든 마커 표시, 아니면 선택된 로봇만 표시
        map: (clickRobot === null || parseInt(clickRobot) === robot.robots_idx) ? map : null
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick(robot.robots_idx);
      });

      robotMarkersRef.current.push(marker);
    });

    // cleanup 함수
    return () => {
      robotMarkersRef.current.forEach((marker) => marker.setMap(null));
      robotMarkersRef.current = [];
    };
  }, [map, robots, clickRobot, onMarkerClick, robotPosition]);

  return null; // 화면에 직접 표시할 요소는 없고, 마커만 지도 위에 띄움
}

export default RobotMarkers;