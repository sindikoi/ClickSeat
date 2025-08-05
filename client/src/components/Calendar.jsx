import React, { useState, useEffect, useMemo } from 'react';
import { HebrewCalendar, Location, HDate } from '@hebcal/core';
import { useNavigate } from 'react-router-dom';
import '../style/calendar.css';

function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [jewishEvents, setJewishEvents] = useState([]); // State for Jewish events
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
    ownerEmail: '',
  });

  const getHebrewDate = (gregorianDate) => {
    try {
      const hd = new HDate(gregorianDate);
      return hd.renderGematriya(true); // Using a more robust rendering
    } catch (e) {
      return '';
    }
  };

  // Fetch Jewish events only when the month changes
  useEffect(() => {
    const getJewishEventsForMonth = (year, month) => {
      try {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const options = {
          start: startDate,
          end: endDate,
          isHebrewYear: true,
          location: Location.lookup('Jerusalem'),
          sedrot: false, // Do not fetch weekly portions
          candlelighting: false, // Do not fetch candle lighting times
          omer: true, // Include omer count
          holidays: true,
          language: 'he',
        };

        const hebrewCalEvents = HebrewCalendar.calendar(options);

        // Filter to get only holidays and important events
        const filteredEvents = hebrewCalEvents.filter((ev) => {
          const cat = ev.getCategories();
          return (
            cat.includes('holiday') ||
            cat.includes('fast') ||
            cat.includes('omer') ||
            ev.getDesc() === 'Rosh Chodesh'
          );
        });

        return filteredEvents.map((event) => ({
          id: `jewish-${event.basename}-${event.getDate().greg().getTime()}`,
          title: event.render('he'),
          date: event.getDate().greg().toISOString().split('T')[0],
          type: event.getCategories().includes('holiday')
            ? 'חג'
            : event.getCategories().includes('fast')
              ? 'צום'
              : 'אירוע',
          isJewish: true,
        }));
      } catch (error) {
        console.error('שגיאה בטעינת אירועים יהודיים:', error);
        return [];
      }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const fetchedJewishEvents = getJewishEventsForMonth(year, month);
    setJewishEvents(fetchedJewishEvents);
  }, [currentDate]);

  // Load user events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = localStorage.getItem('clickSeat_events');
      if (savedEvents) {
        try {
          const eventsData = JSON.parse(savedEvents);
          const calendarEvents = eventsData.map((event) => {
            const dateParts = event.date.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            return {
              id: event.id,
              title: event.name,
              description: event.condition || '',
              time: '',
              type: event.kind,
              date: formattedDate,
              fullDate: new Date(formattedDate).toISOString(),
            };
          });
          setEvents(calendarEvents);
        } catch (error) {
          console.error('שגיאה בטעינת אירועים:', error);
        }
      }
    };

    loadEvents();

    const handleStorageChange = () => {
      loadEvents();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      'ינואר',
      'פברואר',
      'מרץ',
      'אפריל',
      'מאי',
      'יוני',
      'יולי',
      'אוגוסט',
      'ספטמבר',
      'אוקטובר',
      'נובמבר',
      'דצמבר',
    ];
    return months[date.getMonth()];
  };

  const getDayName = (dayIndex) => {
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    return days[dayIndex];
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    setShowEventForm(true);
  };

  const [showEventMenu, setShowEventMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    if (event.id && !event.isJewish) {
      const rect = e.target.getBoundingClientRect();
      setMenuPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY + 5
      });
      setShowEventMenu(event.id);
    }
  };

  const handleEditEvent = (event) => {
    const savedEvents = JSON.parse(
      localStorage.getItem('clickSeat_events') || '[]'
    );
    const savedEvent = savedEvents.find((e) => e.id === event.id);

    if (savedEvent) {
      setNewEvent({
        title: savedEvent.name || event.title,
        description: savedEvent.condition || event.description,
        time: savedEvent.time || event.time,
        type: savedEvent.kind || event.type,
        place: savedEvent.place || '',
        numberOfGuests: savedEvent.numberOfGuests || '',
        seatingLimit: savedEvent.seatingLimit || '',
        ownerName: savedEvent.ownerName || '',
        ownerPhone: savedEvent.ownerPhone || '',
        ownerEmail: savedEvent.ownerEmail || '',
      });
    } else {
      setNewEvent({
        title: event.title,
        description: event.description,
        time: event.time,
        type: event.type,
        place: '',
        numberOfGuests: '',
        seatingLimit: '',
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
      });
    }

    setEditingEvent(event);
    setShowEventMenu(null);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    if (editingEvent) {
      const existingEvents = JSON.parse(
        localStorage.getItem('clickSeat_events') || '[]'
      );
      const updatedEvents = existingEvents.map((event) =>
        event.id === editingEvent.id
          ? {
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
              time: newEvent.time || '19:00',
            }
          : event
      );
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));

      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                title: newEvent.title,
                description: newEvent.description,
                time: newEvent.time,
                type: newEvent.type,
              }
            : event
        )
      );

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
        ownerEmail: '',
      });
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
        date: `${day}-${month}-${year}`,
        time: newEvent.time || '19:00',
      };

      const existingEvents = JSON.parse(
        localStorage.getItem('clickSeat_events') || '[]'
      );
      const updatedEvents = [...existingEvents, eventToAdd];
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));

      setEvents((prev) => [
        ...prev,
        {
          id: eventToAdd.id,
          title: eventToAdd.name,
          description: eventToAdd.condition,
          time: eventToAdd.time,
          type: eventToAdd.kind,
          date: dateString,
          fullDate: selectedDate.toISOString(),
        },
      ]);

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
        ownerEmail: '',
      });
      setShowEventForm(false);
      setSelectedDate(null);

      window.dispatchEvent(new Event('storage'));
    }
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האירוע הזה?')) {
      const existingEvents = JSON.parse(
        localStorage.getItem('clickSeat_events') || '[]'
      );
      const updatedEvents = existingEvents.filter(
        (event) => event.id !== eventId
      );
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const getEventsForDate = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;

    const userEvents = events.filter((event) => event.date === dateString);
    const dayJewishEvents = jewishEvents.filter(
      (event) => event.date === dateString
    );

    return [...userEvents, ...dayJewishEvents];
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const days = [];

  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    const isToday =
      new Date().toDateString() ===
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).toDateString();

    const currentDateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
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
            {dayEvents.slice(0, 3).map(
              (
                event // Increased to 3
              ) => (
                <div key={event.id} className="event-container">
                  <div
                    className={`event-title ${event.isJewish ? 'jewish' : ''} ${event.type === 'חג' ? 'holiday' : ''} ${event.type === 'צום' ? 'fast' : ''} ${!event.isJewish ? 'clickable' : ''}`}
                    title={event.title}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    {event.title}
                  </div>
                  {showEventMenu === event.id && !event.isJewish && (
                    <div 
                      className="event-menu"
                      style={{
                        left: `${menuPosition.x}px`,
                        top: `${menuPosition.y}px`
                      }}
                    >
                      <button
                        onClick={() => navigate(`/סטטוס-אירוע/${event.id}`)}
                      >
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
              )
            )}
            {dayEvents.length > 3 && (
              <div className="more-events">+{dayEvents.length - 3}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEventMenu && !event.target.closest('.event-container')) {
        setShowEventMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showEventMenu]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>
          ◀
        </button>
        <h2>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h2>
        <button className="nav-btn" onClick={nextMonth}>
          ▶
        </button>
      </div>

      <div className="calendar-weekdays">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <div key={day} className="weekday">
            {getDayName(day)}
          </div>
        ))}
      </div>

      <div className="calendar-grid">{days}</div>

      {(showEventForm || editingEvent) && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h3>
              {editingEvent
                ? 'עריכת אירוע'
                : `הוספת אירוע ל-${selectedDate?.toLocaleDateString('he-IL')}`}
            </h3>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}>
              <div className="form-section">
                <h4 className="section-title">פרטי בעל האירוע</h4>
                <div className="form-grid">
                  <div className="field-group half-width">
                    <label className="field-label required">שם בעל האירוע</label>
                    <input
                      type="text"
                      value={newEvent.ownerName}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          ownerName: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="שם פרטי ומשפחה"
                      required
                    />
                  </div>
                  <div className="field-group half-width">
                    <label className="field-label required">טלפון נייד</label>
                    <input
                      type="tel"
                      value={newEvent.ownerPhone}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          ownerPhone: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="050-1234567"
                      required
                    />
                  </div>
                  <div className="field-group full-width">
                    <label className="field-label required">אימייל</label>
                    <input
                      type="email"
                      value={newEvent.ownerEmail}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          ownerEmail: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="section-title">פרטי האירוע</h4>
                <div className="form-grid">
                  <div className="field-group half-width">
                    <label className="field-label required">שם האירוע</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="למשל: חתונת יוסי ושרה"
                      required
                    />
                  </div>
                  <div className="field-group half-width">
                    <label className="field-label required">סוג אירוע</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="field-input"
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
                  
                  <div className="field-group half-width">
                    <label className="field-label required">אולם</label>
                    <input
                      type="text"
                      value={newEvent.place}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          place: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="הכנס שם האולם"
                      required
                    />
                  </div>
                  <div className="field-group half-width">
                    <label className="field-label required">שעה</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                      }
                      className="field-input"
                      required
                    />
                  </div>
                  
                  <div className="field-group half-width">
                    <label className="field-label required">מספר אורחים</label>
                    <input
                      type="number"
                      value={newEvent.numberOfGuests}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          numberOfGuests: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="למשל: 150"
                      min="1"
                      required
                    />
                  </div>
                  <div className="field-group half-width">
                    <label className="field-label">הגבלת מקומות ישיבה</label>
                    <input
                      type="number"
                      value={newEvent.seatingLimit}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          seatingLimit: e.target.value,
                        }))
                      }
                      className="field-input"
                      placeholder="אופציונלי"
                      min="0"
                    />
                  </div>
                  
                  <div className="field-group full-width">
                    <label className="field-label">הערות ופרטים נוספים</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="field-textarea"
                      rows="3"
                      placeholder="הוסף כל מידע נוסף הרלוונטי לאירוע..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <span>✓</span>
                  {editingEvent ? 'עדכן אירוע' : 'הוסף אירוע'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
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
                      ownerEmail: '',
                    });
                  }}
                >
                  <span>✕</span>
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
