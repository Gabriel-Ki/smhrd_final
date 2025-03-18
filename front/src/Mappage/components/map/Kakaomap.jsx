import { useEffect, useRef, useState } from "react";
import RobotMarkers from "./RobotMarkers";

const KakaoMap = ({ robots,onMarkerClick,clickRobot}) => {
  const [map, setMap] = useState(null);
  const [routePolyline,setRoutePolyline]=useState(null);
  const [destinationMarker,setDestinationMarker]=useState(null);

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

    // 기존 도착지 마커 제거 클릭한 마커의 도착지만 보여야하니까
    if(destinationMarker){
      destinationMarker.setMap(null);
      setDestinationMarker(null);
    }

    if (!clickRobot) return;


    

    // 도착지 좌표 설정
    const destinationPosition= new window.kakao.maps.LatLng(
      parseFloat(clickRobot.dest_x),
      parseFloat(clickRobot.dest_y)
    );

    

    const marker=new window.kakao.maps.Marker({
      position: destinationPosition,
      // image: new window.kakao.maps.MarkerImage(
      //   "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      //   new window.kakao.maps.Size(50,50)
      // ),
      // image : new window.kakao.maps.MarkerImage(
      //   "/img/dest.png",
      //   new window.kakao.maps.Size(40,40)
      // ),
      map:map,
      zIndex:9999
    });

    // marker.setMap(map);
    // console.log('지도 마커 추가',marker.getMap());

    setDestinationMarker(marker);
    // map.setCenter(destinationPosition);

  //   setTimeout(() => {
  //     const markerElements=document.querySelectorAll("img[src*='destination.png']");
  //     markerElements.forEach(el=>{
  //       el.style.clip='auto'
  //       el.style.display='block';
  //       el.style.opacity="1";
  //       el.style.zIndex="9999"
  //     });
  // }, 500);

    // map.setCenter(destinationPosition);
    // console.log('도착지 마커 추가', destinationMarker);

    const line=`출발지와 도착지 좌표 준비 (카카오네비 API는 "경도,위도" 순서)`


    // console.log(clickRobot.robot_x,clickRobot.robot_y)
    // const origin = `${parseFloat(clickRobot.robot_y)},${parseFloat(clickRobot.robot_x)}`;
    // const destination = `${parseFloat(clickRobot.dest_y)},${parseFloat(clickRobot.dest_x)}`;
  
    // const fetchRoute = async () => {
    //   const REST_API_KEY = "ed531a847334567de57d04550605bfce";
    //   const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND`;
    //   try {
    //     const response = await fetch(url, {
    //       method:"GET",
    //       headers: {
    //         "Authorization": `KakaoAK ${REST_API_KEY}`,
    //         "Content-Type" : "application/json",
    //       },
    //     });
    //     const data = await response.json();
    //     // 경로 좌표 파싱 (예시: 첫 번째 경로의 섹션들)
    //     // console.log(data);
    //     if(!data || !data.routes || data.routes.length ===0) return;
    //       // console.error("API 응답 데이터:", data)
          
        
    //     const sections = data.routes[0]?.sections;
    //     if (!sections || sections.length === 0) return;


    //     let pathCoords = [];
    //     sections.forEach((section) => {
    //       section.roads.forEach((road) => {
    //         const vertices = road.vertexes;
    //         for (let i = 0; i < vertices.length; i += 2) {
    //           const lng = vertices[i];
    //           const lat = vertices[i + 1];
    //           pathCoords.push(new window.kakao.maps.LatLng(lat, lng));
    //         }
    //       });
    //     });

    //     // 이전 경로 제거 (있다면)
    //     if (routePolyline) {
    //       routePolyline.setMap(null);
    //     }

    //     // Polyline 생성
    //     const polyline = new window.kakao.maps.Polyline({
    //       path: pathCoords,
    //       strokeWeight: 5,
    //       strokeColor: "#FF0000",
    //       strokeOpacity: 0.8,
    //       strokeStyle: "solid",
    //     });
    //     polyline.setMap(map);
    //     setRoutePolyline(polyline);

    //     // 지도 범위 재설정
    //     const bounds = new window.kakao.maps.LatLngBounds();
    //     pathCoords.forEach((coord) => bounds.extend(coord));
    //     // map.setBounds(bounds);
    //   } catch (error) {
    //     console.error("카카오네비 API 호출 오류:", error);
    //   }
    // };

    // fetchRoute();
  }, [map, clickRobot]);

  // useEffect(()=>{
  //   if(destinationMarker){
  //     console.log('마커 성공', destinationMarker);
  //     console.log('마커 추가 지도 객체',destinationMarker.getMap());
  //   }
  // },[destinationMarker])

  






  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px", borderRadius:'15px'}}></div>
      {map && <RobotMarkers map={map} onMarkerClick={onMarkerClick} robots={robots} clickRobot={clickRobot ? clickRobot.robots_idx : null}/>}
    </div>
  );
};

export default KakaoMap;
