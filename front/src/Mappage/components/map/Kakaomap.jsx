import { useEffect, useRef, useState } from "react";
import RobotMarkers from "./RobotMarkers";

const KakaoMap = ({ robots, onMarkerClick, clickRobot }) => {
  const [map, setMap] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  useEffect(() => {
    // ✅ API가 정상적으로 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    // ✅ 지도 생성
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(35.150220, 126.913850),
      level: 3
    };
    const newMap = new window.kakao.maps.Map(container, options);
    setMap(newMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    // 기존 도착지 마커와 경로 제거
    if (destinationMarker) {
      destinationMarker.setMap(null);
      setDestinationMarker(null);
    }

    if (routePolyline) {
      routePolyline.setMap(null);
      setRoutePolyline(null);
    }

    if (!clickRobot) return;

    // 도착지 좌표 설정
    const destinationPosition = new window.kakao.maps.LatLng(
      parseFloat(clickRobot.dest_x),
      parseFloat(clickRobot.dest_y)
    );

    // 도착지 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: destinationPosition,
      image: new window.kakao.maps.MarkerImage(
        "/img/dest.png",
        new window.kakao.maps.Size(40, 40)
      ),
      map: map,
      zIndex: 9999
    });

    setDestinationMarker(marker);

    // 카카오네비 API에 필요한 좌표 준비 (경도,위도 순서)
    // const origin = `${parseFloat(clickRobot.robot_x)},${parseFloat(clickRobot.robot_y)}`;
    const origin = `${parseFloat(clickRobot.robot_y)},${parseFloat(clickRobot.robot_x)}`;
    // const destination = `${parseFloat(clickRobot.dest_x)},${parseFloat(clickRobot.dest_y)}`;
    const destination = `${parseFloat(clickRobot.dest_y)},${parseFloat(clickRobot.dest_x)}`;
  
    const fetchRoute = async () => {
      const REST_API_KEY = "ed531a847334567de57d04550605bfce"; // 실제 앱에서는 환경변수로 관리하세요
      const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND`;
      
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (!data || !data.routes || data.routes.length === 0) {
          console.error("경로 데이터를 받아오지 못했습니다:", data);
          return;
        }
          
        const sections = data.routes[0]?.sections;
        if (!sections || sections.length === 0) return;

        let pathCoords = [];
        sections.forEach((section) => {
          section.roads.forEach((road) => {
            const vertices = road.vertexes;
            for (let i = 0; i < vertices.length; i += 2) {
              const lng = vertices[i];
              const lat = vertices[i + 1];
              pathCoords.push(new window.kakao.maps.LatLng(lat, lng));
            }
          });
        });

        // Polyline 생성
        const polyline = new window.kakao.maps.Polyline({
          path: pathCoords,
          strokeWeight: 5,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        });
        
        polyline.setMap(map);
        setRoutePolyline(polyline);

        // // 경로가 모두 보이도록 지도 범위 재설정
        // const bounds = new window.kakao.maps.LatLngBounds();
        // pathCoords.forEach((coord) => bounds.extend(coord));
        // map.setBounds(bounds);
      } catch (error) {
        console.error("카카오네비 API 호출 오류:", error);
      }
    };

    // 경로 정보 가져오기
    fetchRoute();
  }, [map, clickRobot]);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px", borderRadius: '15px' }}></div>
      {map && <RobotMarkers map={map} onMarkerClick={onMarkerClick} robots={robots} clickRobot={clickRobot ? clickRobot.robots_idx : null} />}
    </div>
  );
};

export default KakaoMap;