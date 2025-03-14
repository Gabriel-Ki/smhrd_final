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


function App() {
  return (
    <div className="App">
      {/* <MainDash/> */}
      {/* <Main_card/> */}
      {/* <Grid/> */}
      {/* <Maindash/> */}
      {/* <OrderItem/> */}
      <Orderpage/>
      {/* <OrderSidebar/> */}
      {/* <DeliveryPage></DeliveryPage> */}

    </div>
  );
}

export default App;
