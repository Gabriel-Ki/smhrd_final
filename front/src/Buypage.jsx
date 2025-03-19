import React, { useState } from 'react';
import axios from 'axios';
import './Buypage.css';

function BuyPage() {
  // 목적지 및 좌표 상태
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [error, setError] = useState('');

  // 카카오 API 키
  const REST_API_KEY = "ed531a847334567de57d04550605bfce"; // 🔹 여기에 실제 발급받은 키 입력

  // 메뉴 상태
  const [menuQuantities, setMenuQuantities] = useState({
    jjajangmyeon: 0,
    jjamppong: 0,
    tangsuyuk: 0,
    yurinji: 0,
    kkansyosaehu: 0
  });

  // 메뉴 가격
  const prices = {
    jjajangmyeon: 6000,
    jjamppong: 7000,
    tangsuyuk: 18000,
    yurinji: 20000,
    kkansyosaehu: 22000
  };

  // 주소 → 좌표 변환 (비동기 함수)
  const fetchCoordinates = async () => {
    if (!destination) {
      setError("주소를 입력하세요.");
      return null;
    }
    setError("");

    try {
      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/search/address.json",
        {
          headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
          params: { query: destination }
        }
      );

      if (response.data.documents.length > 0) {
        const { x, y } = response.data.documents[0]; // 첫 번째 결과 사용
        setCoordinates({ lat: y, lng: x });
        return { lat: y, lng: x };
      } else {
        setError("해당 주소를 찾을 수 없습니다.");
        return null;
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      setError("API 요청 중 오류가 발생했습니다.");
      return null;
    }
  };

  // 총 가격 계산
  const calculateTotal = () => {
    return Object.keys(menuQuantities).reduce((total, key) => {
      return total + menuQuantities[key] * prices[key];
    }, 0);
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 먼저 주소를 좌표로 변환
    const coords = await fetchCoordinates();
    if (!coords) return; // 좌표를 못 찾으면 중단

    // 2. 주문 데이터 생성 (주소 + 좌표 + 메뉴)
    const orderData = {
      destination: destination,
      coordinates: coords, // { lat, lng }
      items: menuQuantities, // 메뉴 개수 그대로 전송
      totalPrice: Object.keys(menuQuantities).reduce(
        (total, key) => total + menuQuantities[key] * prices[key], 0
      )
    };

    // 3. 백엔드로 데이터 전송
    try {
      const response = await axios.post('http://localhost:5000/buy', orderData);
      console.log(response.data);
      alert('주문이 성공적으로 등록되었습니다!');

      // 4. 폼 초기화
      setDestination('');
      setCoordinates({ lat: null, lng: null });
      setMenuQuantities({ jjajangmyeon: 0, jjamppong: 0, tangsuyuk: 0, yurinji: 0, kkansyosaehu: 0 });
    } catch (error) {
      console.error(error);
      alert('주문 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="order-container">
      <h1>주문 입력</h1>
      <form onSubmit={handleSubmit} className="order-form">
        {/* 주소 입력 */}
        <label htmlFor="destination">목적지 주소</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="예: 주소 입력"
          required
        />

        {/* 메뉴 선택 (map 활용) */}
        <h2>메뉴 선택</h2>
        {Object.keys(prices).map((menu) => (
          <div className="menu-item" key={menu}>
            <label>{menu} ({prices[menu]}원)</label>
            <input
              type="number"
              min="0"
              value={menuQuantities[menu]}
              onChange={(e) =>
                setMenuQuantities((prev) => ({
                  ...prev,
                  [menu]: Number(e.target.value),
                }))
              }
            />
          </div>
        ))}

        {/* 총 가격 */}
        <div className="total-price">
          총 가격: <span>{calculateTotal()}</span> 원
        </div>

        {/* 좌표 확인 */}
        {coordinates.lat && (
          <div className="coords-info">
            <p>위도: {coordinates.lat}</p>
            <p>경도: {coordinates.lng}</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 주문 제출 버튼 */}
        <button type="submit" className="submit-btn">
          주문 제출
        </button>
      </form>
    </div>
  );
}

export default BuyPage;
