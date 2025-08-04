import "../style/slider.css";
import { useState } from "react";

function Slider({ onMenuClick }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuItem) => {
    console.log(`נבחר: ${menuItem}`);
    if (onMenuClick) {
      onMenuClick(menuItem);
    }
  };

  return (
    <div className={`slider ${isOpen ? 'open' : 'closed'}`}>
      <div className="slider-header">
        <p className="headline">ברוך הבא</p>
        <button className="toggle-btn" onClick={toggleSlider}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
      
      {isOpen && (
        <div className="slider-content">
          <button 
            className="menu-item"
            onClick={() => handleMenuClick('ראשי')}
          >
            🏠 ראשי
          </button>
          <button 
            className="menu-item"
            onClick={() => handleMenuClick('הגדרות')}
          >
            ⚙️ הגדרות
          </button>
          <button 
            className="menu-item"
            onClick={() => handleMenuClick('משתמשים')}
          >
            👥 משתמשים
          </button>
          <button 
            className="menu-item"
            onClick={() => handleMenuClick('הודעות')}
          >
            📧 הודעות
          </button>
          <button 
            className="menu-item"
            onClick={() => handleMenuClick('לוח אירועים')}
          >
            📅 לוח אירועים
          </button>
        </div>
      )}
    </div>
  );
}

export default Slider;
