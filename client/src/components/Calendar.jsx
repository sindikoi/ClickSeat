import React, { useState, useEffect } from 'react';
import { HebrewCalendar, Location, HDate } from '@hebcal/core';
import { useNavigate } from 'react-router-dom';
import '../style/calendar.css';

function Calendar({ onMenuClick }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'חתונה',
    place: '',
    numberOfGuests: '',
    seatingLimit: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: ''
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

  const [showEventMenu, setShowEventMenu] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEventClick = (event, e) => {
    e.stopPropagation(); // מונע הפעלת handleDateClick
    if (event.id && !event.isJewish) {
      setShowEventMenu(event.id);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventMenu(null);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    if (editingEvent) {
      // עדכון ב-localStorage
      const existingEvents = JSON.parse(localStorage.getItem('clickSeat_events') || '[]');
      const updatedEvents = existingEvents.map(event => 
        event.id === editingEvent.id ? {
          ...event,
          name: newEvent.title,
          kind: newEvent.type,
          place: newEvent.place,
          numberOfGuests: newEvent.numberOfGuests,
          seatingLimit: newEvent.seatingLimit,
          ownerName: newEvent.ownerName,
          ownerPhone: newEvent.ownerPhone,
          ownerEmail: newEvent.ownerEmail,
          condition: newEvent.description || 'פעיל',
          time: newEvent.time || '19:00'
        } : event
      );
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));
      
      // עדכון המצב המקומי
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? {
          ...event,
          title: newEvent.title,
          description: newEvent.description,
          time: newEvent.time,
          type: newEvent.type
        } : event
      ));
      
      setEditingEvent(null);
      setNewEvent({
        title: '',
        description: '',
        time: '',
        type: 'חתונה',
        place: '',
        numberOfGuests: '',
        seatingLimit: '',
        ownerName: '',
        ownerPhone: '',
        ownerEmail: ''
      });
      
      // שליחת אירוע לעדכון
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      // יצירת אירוע בפורמט של Event.jsx
      const eventToAdd = {
        id: Date.now(),
        name: newEvent.title,
        kind: newEvent.type,
        place: newEvent.place,
        numberOfGuests: newEvent.numberOfGuests,
        seatingLimit: newEvent.seatingLimit,
        ownerName: newEvent.ownerName,
        ownerPhone: newEvent.ownerPhone,
        ownerEmail: newEvent.ownerEmail,
        condition: newEvent.description || 'פעיל',
        date: `${day}-${month}-${year}`, // פורמט DD-MM-YYYY
        time: newEvent.time || '19:00'
      };
      
      // שמירה ב-localStorage
      const existingEvents = JSON.parse(localStorage.getItem('clickSeat_events') || '[]');
      const updatedEvents = [...existingEvents, eventToAdd];
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));
      
      // עדכון המצב המקומי
      setEvents(prev => [...prev, {
        id: eventToAdd.id,
        title: eventToAdd.name,
        description: eventToAdd.condition,
        time: eventToAdd.time,
        type: eventToAdd.kind,
        date: dateString,
        fullDate: selectedDate.toISOString()
      }]);
      
      setNewEvent({
        title: '',
        description: '',
        time: '',
        type: 'חתונה',
        place: '',
        numberOfGuests: '',
        seatingLimit: '',
        ownerName: '',
        ownerPhone: '',
        ownerEmail: ''
      });
      setShowEventForm(false);
      setSelectedDate(null);
      
      // שליחת אירוע לעדכון
      window.dispatchEvent(new Event('storage'));
    }
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האירוע הזה?')) {
      // מחיקה מ-localStorage
      const existingEvents = JSON.parse(localStorage.getItem('clickSeat_events') || '[]');
      const updatedEvents = existingEvents.filter(event => event.id !== eventId);
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));
      
      // מחיקה מהמצב המקומי
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
      // שליחת אירוע לעדכון
      window.dispatchEvent(new Event('storage'));
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
               <div key={event.id} className="event-container">
                 <div 
                   className={`event-title ${event.isJewish ? 'jewish' : ''} ${event.type === 'חג' ? 'holiday' : ''} ${event.type === 'צום' ? 'fast' : ''} ${!event.isJewish ? 'clickable' : ''}`} 
                   title={event.title}
                   onClick={(e) => handleEventClick(event, e)}
                 >
                   {event.title}
                 </div>
                 {showEventMenu === event.id && !event.isJewish && (
                   <div className="event-menu">
                     <button onClick={() => navigate(`/סטטוס-אירוע/${event.id}`)}>
                       👁️ צפייה
                     </button>
                     <button onClick={() => handleEditEvent(event)}>
                       ✏️ עריכה
                     </button>
                     <button onClick={() => deleteEvent(event.id)}>
                       🗑️ מחיקה
                     </button>
                   </div>
                 )}
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

      {/* טופס הוספת/עריכת אירוע */}
      {(showEventForm || editingEvent) && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h3>{editingEvent ? 'עריכת אירוע' : `הוספת אירוע ל-${selectedDate?.toLocaleDateString('he-IL')}`}</h3>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}>
              {/* פרטי בעל האירוע */}
              <div className="form-section">
                <h4>פרטי בעל האירוע</h4>
                <div className="form-group">
                  <label>*שם בעל האירוע:</label>
                  <input
                    type="text"
                    value={newEvent.ownerName}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, ownerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>*טלפון:</label>
                  <input
                    type="tel"
                    value={newEvent.ownerPhone}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>*אימייל:</label>
                  <input
                    type="email"
                    value={newEvent.ownerEmail}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, ownerEmail: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* פרטי האירוע */}
              <div className="form-section">
                <h4>פרטי האירוע</h4>
                <div className="form-group">
                  <label>*שם האירוע:</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>סוג אירוע:</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    required
                  >
                    <option value="">בחר</option>
                    <option value="חתונה">חתונה</option>
                    <option value="בר מצווה">בר מצווה</option>
                    <option value="ברית">ברית</option>
                    <option value="יום הולדת">יום הולדת</option>
                    <option value="אירוע עסקי">אירוע עסקי</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>אולם:</label>
                  <select
                    value={newEvent.place}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, place: e.target.value }))}
                    required
                  >
                    <option value="">בחר</option>
                    <option value="אולם ראשי">אולם ראשי</option>
                    <option value="אולם משני">אולם משני</option>
                    <option value="גן אירועים">גן אירועים</option>
                    <option value="מסעדה">מסעדה</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>*שעה:</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>*מספר אורחים:</label>
                  <input
                    type="number"
                    value={newEvent.numberOfGuests}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, numberOfGuests: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>הגבלת כמות אורחים להושבה:</label>
                  <input
                    type="number"
                    value={newEvent.seatingLimit}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, seatingLimit: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>פרטים נוספים:</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingEvent ? 'עדכן אירוע' : 'הוסף אירוע'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                    setNewEvent({
                      title: '',
                      description: '',
                      time: '',
                      type: 'חתונה',
                      place: '',
                      numberOfGuests: '',
                      seatingLimit: '',
                      ownerName: '',
                      ownerPhone: '',
                      ownerEmail: ''
                    });
                  }}
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