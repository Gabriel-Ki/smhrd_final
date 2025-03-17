import logo from './logo.svg';
import './App.css';
import Mainheader from './Main/components/header/Main_header'
import Main_card from './Main/components/card/Main_card';
import Grid from './Main/components/grid/Grid';
import Maindash from './Main/maindash/Maindash';
import DeliveryPage from './Mappage/DeliveryPage';
import OrderItem from './orderList/components/order/OrderItem';
import Orderpage from './orderList/Orderpage'
import OrderSidebar from './orderList/components/sidebar/Ordersidebar'

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App"> 
        <Routes>
          <Route path="/" element={<Orderpage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/maindash" element={<Maindash />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
