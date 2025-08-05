import logo from './logo.svg';
import './App.css';
import Homepage from './pages/Homepage';
import NewEvent from './pages/NewEvent';
import Guests from './pages/Guests';
import Seating from './pages/Seating';
import EventStatus from './pages/EventStatus';
import CalendarPage from './pages/CalendarPage'; // הוספת ייבוא
import Navigation from './components/Navigation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/דף בית" element={<Homepage />} />
          <Route path="/לוח-שנה" element={<CalendarPage />} />{' '}
          {/* שינוי הקומפוננטה */}
          <Route path="/אירוע" element={<NewEvent />} />
          <Route path="/אורחים" element={<Guests />} />
          <Route path="/הושבה" element={<Seating />} />
          <Route path="/סטטוס-אירוע/:eventId" element={<EventStatus />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
