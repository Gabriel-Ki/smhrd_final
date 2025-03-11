import { useEffect, useState } from "react";
import RobotMarkers from "./RobotMarkers";

const KakaoMap = ({ robots,onMarkerClick,clickRobot}) => {
  const [map, setMap] = useState(null);
  const [routePolyline,setRoutePolyline]=useState(null);

  // console.log(onMarkerClick,'kakomap');

  // const robots=[
  //   {id:1, name: '창영-1', lat: 37.5665, lng: 126.9780, status:'배송 중'}, // 여기도 api로 값 가져오기
  //   {id:1, name: '창영-2', lat: 37.5660, lng: 126.9770, status:'대기 중'}
  // ]

  useEffect(() => {
    // ✅ API가 정상적으로 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    // ✅ 지도 생성
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(35.150500, 126.916166),
      level: 3
    };
    const newMap = new window.kakao.maps.Map(container, options);
    setMap(newMap);
  }, []);

  useEffect(()=>{
    if(!map || !robots) return;
  },[map,robots]);

  useEffect(() => {
    if (!map || !clickRobot) return;

    // 출발지와 도착지 좌표 준비 (카카오네비 API는 "경도,위도" 순서)
    const origin = `${clickRobot.longitude},${clickRobot.latitude}`;
    const destination = `${clickRobot.destination_longitude},${clickRobot.destination_latitude}`;

    const fetchRoute = async () => {
      const REST_API_KEY = "cd43b6a1706eecaa4a3a2acdb507a6d7";
      const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND`;
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        });
        const data = await response.json();
        // 경로 좌표 파싱 (예시: 첫 번째 경로의 섹션들)
        console.log(data);
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

        // 이전 경로 제거 (있다면)
        if (routePolyline) {
          routePolyline.setMap(null);
        }

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

        // 지도 범위 재설정
        const bounds = new window.kakao.maps.LatLngBounds();
        pathCoords.forEach((coord) => bounds.extend(coord));
        map.setBounds(bounds);
      } catch (error) {
        console.error("카카오네비 API 호출 오류:", error);
      }
    };

    fetchRoute();
  }, [map, clickRobot]);






  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px", borderRadius:'15px'}}></div>
      {map && <RobotMarkers map={map} onMarkerClick={onMarkerClick} robots={robots}/>}
    </div>
  );
};

export default KakaoMap;
