import "../style/pages.css";
import Slider from "../components/Slider";
import Sliderup from "../components/Sliderup";
import FirstTable from "../components/FirstTable";
import Calendar from "../components/Calendar";
import "../style/tables.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Homepage() {
  const [currentView, setCurrentView] = useState('main'); // 'main' או 'calendar'
  const navigate = useNavigate();
  const location = useLocation();

  // בדיקת ה-URL בעת טעינת הדף
  useEffect(() => {
    console.log('URL השתנה:', location.pathname);
    if (location.pathname === '/לוח-שנה') {
      console.log('מעביר ללוח שנה');
      setCurrentView('calendar');
    } else {
      console.log('מעביר לדף ראשי');
      setCurrentView('main');
    }
  }, [location.pathname]);

  const handleMenuClick = (menuItem) => {
    if (menuItem === 'לוח אירועים') {
      setCurrentView('calendar');
      navigate('/לוח-שנה', { replace: true });
    } else if (menuItem === 'ראשי') {
      setCurrentView('main');
      navigate('/דף בית', { replace: true });
    }
  };

  return (
    <div className="wrapper">
      <div className="Homepage">
        <Sliderup />
        {currentView === 'main' ? (
          <FirstTable/>
        ) : currentView === 'calendar' ? (
          <div className="calendar-view">
            <Calendar onMenuClick={handleMenuClick} />
          </div>
        ) : null}
      </div>
      <Slider onMenuClick={handleMenuClick} />
    </div>
  );
}

export default Homepage;
