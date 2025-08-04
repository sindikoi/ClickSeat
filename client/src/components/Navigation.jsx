import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/navigation.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">ClickSeat</Link>
        </div>
        
        <ul className="nav-links">
          <li className={isActive('/') || isActive('/דף בית') ? 'active' : ''}>
            <Link to="/דף בית">דף בית</Link>
          </li>
          <li className={isActive('/אורחים') ? 'active' : ''}>
            <Link to="/אורחים">ניהול אורחים</Link>
          </li>
          <li className={isActive('/הושבה') ? 'active' : ''}>
            <Link to="/הושבה">הושבה</Link>
          </li>
          <li className={isActive('/אירוע') ? 'active' : ''}>
            <Link to="/אירוע">יצירת אירוע</Link>
          </li>
          <li className={isActive('/לוח-שנה') ? 'active' : ''}>
            <Link to="/לוח-שנה">לוח שנה</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 