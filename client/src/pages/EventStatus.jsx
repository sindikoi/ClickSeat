import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/eventStatus.css';
import Slider from '../components/Slider';
import Sliderup from '../components/Sliderup';

function EventStatus() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // טעינת האירוע לפי ID
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('clickSeat_events') || '[]');
    const foundEvent = savedEvents.find(e => e.id == eventId || e.id === parseInt(eventId));
    
    if (foundEvent) {
      setEvent({
        ...foundEvent,
        time: '19:00',
        hall: 'אולם ראשי',
        maxGuests: foundEvent.numberofGuests || 200,
        confirmedGuests: 150,
        declinedGuests: 20,
        pendingGuests: 30,
        contactPerson: 'דוד כהן',
        contactPhone: '050-1234567',
        contactEmail: 'david@example.com',
        venueAddress: 'רחוב הרצל 123, תל אביב',
        venuePhone: '03-1234567',
        notes: foundEvent.condition || 'אירוע מיוחד'
      });
    }
    setLoading(false);
  }, [eventId]);

  const [guests, setGuests] = useState([
    { id: 1, name: 'משה לוי', status: 'confirmed', phone: '050-1111111', guests: 2 },
    { id: 2, name: 'רחל כהן', status: 'declined', phone: '050-2222222', guests: 0 },
    { id: 3, name: 'יוסי ישראלי', status: 'pending', phone: '050-3333333', guests: 1 },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#28a745';
      case 'declined': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'מאשר';
      case 'declined': return 'לא מאשר';
      case 'pending': return 'ממתין';
      default: return 'לא ידוע';
    }
  };

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;

  if (loading) {
    return <div>טוען...</div>;
  }

  if (!event) {
    return <div>אירוע לא נמצא</div>;
  }

  return (
    <div className="wrapper">
      <div className="allPages">
        <Sliderup />
        <div className="event-status-page">
          <div className="status-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ◀ חזור
            </button>
            <h1>סטטוס אירוע - {event.name}</h1>
          </div>

          <div className="status-grid">
            {/* פרטי האירוע */}
            <div className="status-card event-details">
              <h2>📅 פרטי האירוע</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>שם האירוע:</strong>
                  <span>{event.name}</span>
                </div>
                <div className="detail-item">
                  <strong>תאריך:</strong>
                  <span>{new Date(event.date).toLocaleDateString('he-IL')}</span>
                </div>
                <div className="detail-item">
                  <strong>שעה:</strong>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <strong>סוג אירוע:</strong>
                  <span>{event.kind}</span>
                </div>
                <div className="detail-item">
                  <strong>מקום:</strong>
                  <span>{event.place}</span>
                </div>
                <div className="detail-item">
                  <strong>אולם:</strong>
                  <span>{event.hall}</span>
                </div>
              </div>
            </div>

            {/* אנשי קשר */}
            <div className="status-card contact-details">
              <h2>📞 אנשי קשר</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>איש קשר:</strong>
                  <span>{event.contactPerson}</span>
                </div>
                <div className="detail-item">
                  <strong>טלפון:</strong>
                  <a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a>
                </div>
                <div className="detail-item">
                  <strong>אימייל:</strong>
                  <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
                </div>
              </div>
            </div>

            {/* פרטי האולם */}
            <div className="status-card venue-details">
              <h2>🏢 פרטי האולם</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>כתובת:</strong>
                  <span>{event.venueAddress}</span>
                </div>
                <div className="detail-item">
                  <strong>טלפון:</strong>
                  <a href={`tel:${event.venuePhone}`}>{event.venuePhone}</a>
                </div>
                <div className="detail-item">
                  <strong>קיבולת מקסימלית:</strong>
                  <span>{event.maxGuests} אנשים</span>
                </div>
              </div>
            </div>

            {/* סטטיסטיקות */}
            <div className="status-card statistics">
              <h2>📊 סטטיסטיקות</h2>
              <div className="stats-grid">
                <div className="stat-item confirmed">
                  <div className="stat-number">{confirmedCount}</div>
                  <div className="stat-label">מאשרים</div>
                </div>
                <div className="stat-item declined">
                  <div className="stat-number">{declinedCount}</div>
                  <div className="stat-label">לא מאשרים</div>
                </div>
                <div className="stat-item pending">
                  <div className="stat-number">{pendingCount}</div>
                  <div className="stat-label">ממתינים</div>
                </div>
                <div className="stat-item total">
                  <div className="stat-number">{guests.length}</div>
                  <div className="stat-label">סה"כ</div>
                </div>
              </div>
            </div>
          </div>

          {/* רשימת אורחים */}
          <div className="guests-section">
            <div className="section-header">
              <h2>👥 רשימת אורחים</h2>
              <button className="add-guest-btn" onClick={() => navigate('/אורחים')}>
                ➕ הוסף אורח
              </button>
            </div>
            
            <div className="guests-table">
              <table>
                <thead>
                  <tr>
                    <th>שם</th>
                    <th>סטטוס</th>
                    <th>טלפון</th>
                    <th>מספר אורחים</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(guest => (
                    <tr key={guest.id}>
                      <td>{guest.name}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(guest.status) }}
                        >
                          {getStatusText(guest.status)}
                        </span>
                      </td>
                      <td>{guest.phone}</td>
                      <td>{guest.guests}</td>
                      <td>
                        <button className="action-btn">✏️</button>
                        <button className="action-btn danger">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate('/אורחים')}>
              👥 ניהול אורחים
            </button>
            <button className="btn-secondary" onClick={() => navigate('/הושבה')}>
              🪑 מפת הישיבה
            </button>
            <button className="btn-edit" onClick={() => navigate(`/עריכת-אירוע/${eventId}`)}>
              ✏️ עריכת אירוע
            </button>
          </div>
        </div>
      </div>
      <Slider />
    </div>
  );
}

export default EventStatus; 