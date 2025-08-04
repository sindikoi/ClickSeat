import "../style/pages.css";
import Slider from "../components/Slider";
import Sliderup from "../components/Sliderup";
import FirstTable from "../components/FirstTable";
import Calendar from "../components/Calendar";
import "../style/tables.css";
import { useState } from "react";

function Homepage() {
  const [currentView, setCurrentView] = useState('main'); // 'main' או 'calendar'

  const handleMenuClick = (menuItem) => {
    if (menuItem === 'לוח אירועים') {
      setCurrentView('calendar');
    } else if (menuItem === 'ראשי') {
      setCurrentView('main');
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
