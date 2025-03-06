import { useEffect } from "react";

const RobotMarkers = ({ map, robots, onMarkerClick}) => {
  useEffect(() => {
    if (!map || !robots) return;

    robots.forEach(robot => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(robot.lat, robot.lng),
        map: map
      });

      // 마커 클릭 이벤트 추가
      window.kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick(robot);
      });
    });
  }, [map, robots]);

  return null;
};

export default RobotMarkers;
  