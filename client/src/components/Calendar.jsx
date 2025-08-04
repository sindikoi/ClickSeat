import React, { useState, useEffect } from 'react';
import '../style/calendar.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'חתונה'
  });

  // טעינת אירועים מ-localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('clickSeat_calendar_events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('שגיאה בטעינת אירועים:', error);
      }
    }
  }, []);

  // שמירת אירועים ל-localStorage
  useEffect(() => {
    localStorage.setItem('clickSeat_calendar_events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMonthName = (date) => {
    const months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    return months[date.getMonth()];
  };

  const getDayName = (dayIndex) => {
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    return days[dayIndex];
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setShowEventForm(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title && selectedDate) {
      const event = {
        id: Date.now(),
        ...newEvent,
        date: selectedDate.toISOString().split('T')[0],
        fullDate: selectedDate.toISOString()
      };
      
      setEvents(prev => [...prev, event]);
      setNewEvent({ title: '', description: '', time: '', type: 'חתונה' });
      setShowEventForm(false);
      setSelectedDate(null);
    }
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האירוע הזה?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const getEventsForDate = (day) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const days = [];
  
  // הוספת ימים ריקים בתחילת החודש
  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // הוספת ימי החודש
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    days.push(
      <div 
        key={day} 
        className={`calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <span className="day-number">{day}</span>
        {dayEvents.length > 0 && (
          <div className="events-indicator">
            {dayEvents.slice(0, 2).map(event => (
              <div key={event.id} className="event-dot" title={event.title}></div>
            ))}
            {dayEvents.length > 2 && (
              <div className="more-events">+{dayEvents.length - 2}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>◀</button>
        <h2>{getMonthName(currentDate)} {currentDate.getFullYear()}</h2>
        <button className="nav-btn" onClick={nextMonth}>▶</button>
      </div>
      
      <div className="calendar-weekdays">
        {[0, 1, 2, 3, 4, 5, 6].map(day => (
          <div key={day} className="weekday">{getDayName(day)}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {days}
      </div>

      {/* טופס הוספת אירוע */}
      {showEventForm && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h3>הוספת אירוע ל-{selectedDate?.toLocaleDateString('he-IL')}</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>כותרת האירוע:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>סוג האירוע:</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="חתונה">חתונה</option>
                  <option value="בר מצווה">בר מצווה</option>
                  <option value="ברית">ברית</option>
                  <option value="יום הולדת">יום הולדת</option>
                  <option value="אירוע עסקי">אירוע עסקי</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>שעה:</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>תיאור:</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn-primary">הוסף אירוע</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowEventForm(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* רשימת אירועים */}
      <div className="events-list">
        <h3>אירועים קרובים</h3>
        {events
          .filter(event => new Date(event.fullDate) >= new Date())
          .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
          .slice(0, 5)
          .map(event => (
            <div key={event.id} className="event-item">
              <div className="event-info">
                <h4>{event.title}</h4>
                <p>{new Date(event.date).toLocaleDateString('he-IL')} {event.time}</p>
                <span className="event-type">{event.type}</span>
              </div>
              <button 
                className="delete-event-btn"
                onClick={() => deleteEvent(event.id)}
              >
                🗑️
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Calendar; 