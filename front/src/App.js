import logo from './logo.svg';
import './App.css';
import Mainheader from './Main/components/header/Main_header'
import Main_card from './Main/components/card/Main_card';
import Grid from './Main/components/grid/Grid';
import Maindash from './Main/maindash/Maindash';
import DeliveryPage from './Mappage/DeliveryPage';


function App() {
  return (
    <div className="App">
      {/* <MainDash/> */}
      {/* <Main_card/> */}
      {/* <Grid/> */}
      {/* <Maindash/> */}
      <DeliveryPage></DeliveryPage>
    </div>
  );
}

export default App;
