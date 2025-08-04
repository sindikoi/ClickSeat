import React, { useState, useEffect } from 'react';
import { HebrewCalendar, Location, HDate } from '@hebcal/core';
import '../style/calendar.css';

function Calendar({ onMenuClick }) {
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

  // פונקציה לקבלת תאריך עברי (גרסה פשוטה)
  const getHebrewDate = (gregorianDate) => {
    try {
      const hd = new HDate(gregorianDate);
      const hebrewMonths = [
        'ניסן', 'אייר', 'סיוון', 'תמוז', 'אב', 'אלול',
        'תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר'
      ];
      const monthName = hebrewMonths[hd.getMonth() - 1];
      return `${hd.getDate()} ${monthName}`;
    } catch (e) {
      return '';
    }
  };

  // פונקציה לקבלת אירועים יהודיים לחודש נתון
  const getJewishEventsForMonth = (year, month) => {
    try {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const options = {
        start: startDate,
        end: endDate,
        location: Location.lookup('Jerusalem'),
        sedrot: true,
        candlelighting: true,
        language: 'he'
      };
      
      const events = HebrewCalendar.calendar(options);
      return events.map(event => ({
        id: `jewish-${event.basename}-${event.getDate().getTime()}`,
        title: event.render(),
        date: event.getDate().toISOString().split('T')[0],
        type: event.getCategories().includes('holiday') ? 'חג' : 
              event.getCategories().includes('fast') ? 'צום' : 'אירוע',
        isJewish: true
      }));
    } catch (error) {
      console.error('שגיאה בטעינת אירועים יהודיים:', error);
      return [];
    }
  };

  // פונקציה לטיפול בלחיצות על תפריט הסליידר
  const handleSliderMenuClick = (menuItem) => {
    if (onMenuClick) {
      onMenuClick(menuItem);
    }
  };

  // טעינת אירועים מ-localStorage
  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = localStorage.getItem('clickSeat_events');
      console.log('טוען אירועים מהלוח שנה:', savedEvents);
      
      if (savedEvents) {
        try {
          const eventsData = JSON.parse(savedEvents);
          console.log('אירועים שטענו:', eventsData);
          
          // המרת האירועים לפורמט של הלוח שנה
          const calendarEvents = eventsData.map(event => {
            // המרת התאריך מ-DD-MM-YYYY ל-YYYY-MM-DD עבור הלוח שנה
            const dateParts = event.date.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            
            const calendarEvent = {
              id: event.id,
              title: event.name,
              description: event.condition || '',
              time: '',
              type: event.kind,
              date: formattedDate,
              fullDate: new Date(formattedDate).toISOString()
            };
            console.log('אירוע לוח שנה:', calendarEvent);
            return calendarEvent;
          });
          console.log('כל אירועי הלוח שנה:', calendarEvents);
          setEvents(calendarEvents);
        } catch (error) {
          console.error('שגיאה בטעינת אירועים:', error);
        }
      } else {
        console.log('אין אירועים ב-localStorage');
      }
    };

    loadEvents();

    // האזנה לשינויים ב-localStorage
    const handleStorageChange = () => {
      loadEvents();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // שמירת אירועים ל-localStorage (לא נדרש כי האירועים נשמרים בעמוד יצירת אירוע)
  // useEffect(() => {
  //   localStorage.setItem('clickSeat_calendar_events', JSON.stringify(events));
  // }, [events]);

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
    // יצירת תאריך בפורמט YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    
    // קבלת אירועים יהודיים לחודש הנוכחי
    const jewishEvents = getJewishEventsForMonth(year, currentDate.getMonth());
    
    // שילוב אירועים רגילים ואירועים יהודיים
    const allEvents = [...events, ...jewishEvents];
    
    console.log('מחפש אירועים לתאריך:', dateString);
    console.log('כל האירועים:', allEvents);
    
    const dayEvents = allEvents.filter(event => event.date === dateString);
    console.log('אירועים שנמצאו:', dayEvents);
    
    return dayEvents;
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
    
         const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
     const hebrewDate = getHebrewDate(currentDateObj);
     
     days.push(
       <div 
         key={day} 
         className={`calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
         onClick={() => handleDateClick(day)}
       >
         <span className="day-number">{day}</span>
         <span className="hebrew-date">{hebrewDate}</span>
         {dayEvents.length > 0 && (
           <div className="events-indicator">
             {dayEvents.slice(0, 1).map(event => (
               <div 
                 key={event.id} 
                 className={`event-title ${event.isJewish ? 'jewish' : ''} ${event.type === 'חג' ? 'holiday' : ''} ${event.type === 'צום' ? 'fast' : ''}`} 
                 title={event.title}
               >
                 {event.title}
               </div>
             ))}
             {dayEvents.length > 1 && (
               <div className="more-events">+{dayEvents.length - 1}</div>
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

      
    </div>
  );
}

export default Calendar; 