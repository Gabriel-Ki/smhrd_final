import { useEffect, useState } from "react";
import RobotMarkers from "./RobotMarkers";

const KakaoMap = ({ robots,onMarkerselect }) => {
  const [map, setMap] = useState(null);

  // const robots=[
  //   {id:1, name: '창영-1', lat: 37.5665, lng: 126.9780, status:'배송 중'}, // 여기도 api로 값 가져오기
  //   {id:1, name: '창영-2', lat: 37.5660, lng: 126.9770, status:'대기 중'}
  // ]

  useEffect(() => {
    // ✅ API가 정상적으로 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵 API가 로드되지 않았습니다. index.html을 확인하세요!");
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

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px", borderRadius:'15px'}}></div>
      {map && <RobotMarkers map={map} onMarkerClick={onMarkerselect} robots={robots}/>}
    </div>
  );
};

export default KakaoMap;
