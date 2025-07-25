import logo from "./logo.svg";
import "./App.css";
import Homepage from "./pages/Homepage";
import Event from "./pages/Event";
import { BrowserRouter, Routes, Route }  from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element={<Homepage/>}/>{/*דף בית*/}
        <Route path="/דף בית" element={<Homepage/>}/>
        <Route path="/אירוע" element={<Event/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
