import React, { useEffect, useState } from 'react'
import axios from 'axios';
import OrderSide from './components/sidebar/Ordersidebar'
import OrderList from './components/list/OrderList'
import './orderpage.css'

const Orderpage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
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
    const interOrder = setInterval(axiosOrder, 10000);
    return () => clearInterval(interOrder);
  }, [])

  const onOrderClick = (order) => {
    console.log("클릭된 주문", order)
    setSelectedOrder(order);
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
  const totalCount = orders.length;

  return (
    <div className='orderpage'>
      <div className='orderpage-header'> 
        팀장선
      </div>
      <div className='orderpage-container'>
        {/* <div className='orderpage-tabs'>
          <button 
            className={`orderpage-tab ${activeTab === '접수대기' ? 'active' : ''}`}
            onClick={() => setActiveTab('접수대기')}
          >
            주문접수
          </button>
          <button 
            className={`orderpage-tab ${activeTab === '배달관리' ? 'active' : ''}`}
            onClick={() => setActiveTab('배달관리')}
          >
            처리 중
          </button>
          <button 
            className={`orderpage-tab ${activeTab === '배달상황' ? 'active' : ''}`}
            onClick={() => setActiveTab('배달상황')}
          >
            배달완료
          </button>
        </div> */}
        
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
            <OrderSide selectedOrder={selectedOrder} orders={orders} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orderpage