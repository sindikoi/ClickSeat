import '../style/slider.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Slider() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuItem) => {
    if (menuItem === 'ראשי') {
      navigate('/דף בית');
    } else if (menuItem === 'לוח אירועים') {
      navigate('/לוח-שנה');
    }
    // סגירת הסליידר אחרי לחיצה
    setIsOpen(false);
  };

  // console.log('Slider rendered, isOpen:', isOpen);

  return (
    <>
      {/* כפתור קבוע לפתיחת הסליידר */}
      {!isOpen && (
        <button
          className="slider-toggle-fixed"
          onClick={toggleSlider}
          style={{
            position: 'fixed',
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '15px 8px',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '60px',
          }}
        >
          ▶
        </button>
      )}

      <div className={`slider ${isOpen ? 'open' : 'closed'}`}>
        <div className="slider-header">
          <p className="headline">ClickSeat</p>
          <button className="toggle-btn" onClick={toggleSlider}>
            ◀
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
              onClick={() => handleMenuClick('לוח אירועים')}
            >
              📅 לוח אירועים
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Slider;
