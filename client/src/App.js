import logo from "./logo.svg";
import "./App.css";
import Homepage from "./pages/Homepage";
import Event from "./pages/Event";
import Guests from "./pages/Guests";
import Seating from "./pages/Seating";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route }  from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage/>}/>{/*דף בית*/}
        <Route path="/דף בית" element={<Homepage/>}/>
        <Route path="/לוח-שנה" element={<Homepage/>}/>
        <Route path="/אירוע" element={<Event/>}/>
        <Route path="/אורחים" element={<Guests/>}/>
        <Route path="/הושבה" element={<Seating/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
