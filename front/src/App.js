import logo from './logo.svg';
import './App.css';
// import Mainheader from './Main/components/header/Main_header'
// import Main_card from './Main/components/card/Main_card';
// import Grid from './Main/components/grid/Grid';
// import OrderItem from './orderList/components/order/OrderItem';
// import OrderSidebar from './orderList/components/sidebar/Ordersidebar'
import DeliveryPage from './Mappage/DeliveryPage';
import Orderpage from './orderList/Orderpage'
import Maindash from './Main/maindash/Maindash';
import BuyPage from './Buypage';


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App"> 
        <Routes>
          <Route path='/buy' element={<BuyPage/>} />
          <Route path="/" element={<Orderpage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/maindash" element={<Maindash />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
