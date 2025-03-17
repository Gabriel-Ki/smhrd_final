import React, { useEffect, useState } from 'react'
import axios from 'axios';
import OrderSide from './components/sidebar/Ordersidebar'
import OrderList from './components/list/OrderList'
import './orderpage.css'
import { useNavigate } from 'react-router-dom';

const Orderpage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderStatus,setSelectedOrderStatus]=useState("")
  const [activeTab, setActiveTab] = useState('접수대기'); // 기본 탭을 '접수대기'로 설정

  useEffect(() => {
    const axiosOrder = async () => {
      try {
        const response = await axios.get('http://localhost:5000/order');
        setOrders(response.data);
      } catch(err) {
        console.error('주문 정보 가져오는 중 오류:', err);
      }
    }
    axiosOrder();
    const interOrder = setInterval(axiosOrder, 180000);
    return () => clearInterval(interOrder);
  }, [])

  const onOrderClick = (orderId,status) => {
    console.log("클릭된 주문", orderId,status);
    setSelectedOrder(orderId);
    setSelectedOrderStatus(status);
  }

  // 현재 탭에 해당하는 주문만 필터링
  const filteredOrders = orders.filter(order => {
    if (activeTab === '접수대기') return order.order_status === '접수대기';
    if (activeTab === '처리중') return order.order_status === '조리중' || order.order_status === '배달중';
    if (activeTab === '배달완료') return order.order_status === '완료';
    return true; // 기본값은 모든 주문 표시
  });

  // 각 상태별 주문 수 계산
  const waitingCount = orders.filter(order => order.order_status === '접수대기').length;
  const processingCount = orders.filter(order => order.order_status === '조리중' || order.order_status === '배달중').length;
  const totalCount = orders.filter(order => order.order_status ==='배달완료').length;

  return (
    <div className='orderpage'>
      
      <div className='orderpage-header'>
        Delivus
        <div className='orderpage-buttons'>
          <button className="orderpage-btn1" onClick={() => navigate('/maindash')}>대시보드</button>
          <button className="orderpage-btn2" onClick={() => navigate('/delivery')}>지도</button>
        </div>
      </div>
      

      <div className='orderpage-container'>
        <div className='orderpage-box'>
          <div className='orderpage-status-counts'>
            <div className='status-count-item' onClick={()=>setActiveTab('접수대기')}>
              <span className='count-label'>접수대기</span>
              <span className='count-value'>{waitingCount}</span>
            </div>
            <div className='status-count-item' onClick={()=>setActiveTab('처리중')}>
              <span className='count-label'>처리중</span>
              <span className='count-value'>{processingCount}</span>
            </div>
            <div className='status-count-item' onClick={()=>setActiveTab('배달완료')}>
              <span className='count-label'>배달완료</span>
              <span className='count-value'>{totalCount}</span>
            </div>
          </div>
          <div className='orderpage-list'>
            <OrderList orders={filteredOrders} onSelectOrder={onOrderClick} />
          </div>
          <div className='orderpage-sidebar'>
            <OrderSide selectedOrder={selectedOrder} orders={orders} orderStatus={selectedOrderStatus} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orderpage