import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../style/newEvent.css';
import Slider from '../components/Slider';
import Sliderup from '../components/Sliderup';

function NewEvent() {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    date: '',
    name: '',
    kind: '',
    place: '',
    numberOfGuests: '',
    seatingLimit: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    conditions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      date: event.date.split('-').reverse().join('-'),
      name: event.name,
      kind: event.kind,
      place: event.place,
      numberofGuests: event.numberOfGuests,
      seatingLimit: event.seatingLimit,
      ownerName: event.ownerName,
      ownerPhone: event.ownerPhone,
      ownerEmail: event.ownerEmail,
      condition: event.conditions || 'פעיל',
      id: Date.now()
    };

    const existingEvents = JSON.parse(
      localStorage.getItem('clickSeat_events') || '[]'
    );
    const updatedEvents = [...existingEvents, newEvent];
    localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('storage'));

    alert('נוצר אירוע חדש בהצלחה!');
    navigate('/דף בית');
  };

  return (
    <div className="wrapper">
      <Sliderup />
      <div className="new-event-page">
        <div className="new-event-container">
            <h1 className="page-title">יצירת אירוע חדש</h1>
            
            <form onSubmit={handleSubmit} className="new-event-form">
              {/* פרטי בעל האירוע */}
              <div className="form-section">
                <h2 className="section-title">פרטי בעל האירוע</h2>
                
                <div className="form-grid">
                  <div className="field-group half-width">
                    <label className="field-label required">שם בעל האירוע (שם מלא)</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={event.ownerName}
                      onChange={handleChange}
                      className="field-input"
                      required
                    />
                  </div>
                  
                  <div className="field-group full-width">
                    <label className="field-label required">טלפון נייד</label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={event.ownerPhone}
                      onChange={handleChange}
                      className="field-input"
                      placeholder="050-1234567"
                      required
                    />
                  </div>
                  
                  <div className="field-group full-width">
                    <label className="field-label required">אימייל</label>
                    <input
                      type="email"
                      name="ownerEmail"
                      value={event.ownerEmail}
                      onChange={handleChange}
                      className="field-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* פרטי האירוע */}
              <div className="form-section">
                <h2 className="section-title">פרטי האירוע</h2>
                
                <div className="form-grid">
                  <div className="field-group half-width">
                    <label className="field-label required">שם האירוע</label>
                    <input
                      type="text"
                      name="name"
                      value={event.name}
                      onChange={handleChange}
                      className="field-input"
                      required
                    />
                  </div>
                  
                  <div className="field-group half-width">
                    <label className="field-label required">סוג אירוע</label>
                    <select
                      name="kind"
                      value={event.kind}
                      onChange={handleChange}
                      className="field-input"
                      required
                    >
                      <option value="">בחר</option>
                      <option value="חתונה">חתונה</option>
                      <option value="בר מצווה">בר מצווה</option>
                      <option value="בת מצווה">בת מצווה</option>
                      <option value="ברית">ברית</option>
                      <option value="יום הולדת">יום הולדת</option>
                      <option value="אירוע עסקי">אירוע עסקי</option>
                      <option value="כנס">כנס</option>
                      <option value="אחר">אחר</option>
                    </select>
                  </div>
                  
                  <div className="field-group half-width">
                    <label className="field-label required">תאריך האירוע</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={event.date}
                      onChange={handleChange}
                      className="field-input"
                      required
                    />
                  </div>
                  
                  <div className="field-group half-width">
                    <label className="field-label required">אולם</label>
                    <input
                      type="text"
                      name="place"
                      value={event.place}
                      onChange={handleChange}
                      className="field-input"
                      placeholder="הכנס שם האולם"
                      required
                    />
                  </div>
                  
                  <div className="field-group half-width">
                    <label className="field-label required">מספר אורחים</label>
                    <input
                      type="number"
                      name="numberOfGuests"
                      value={event.numberOfGuests}
                      onChange={handleChange}
                      className="field-input"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="field-group half-width">
                    <label className="field-label">הגבלת מקומות אורחים להושבה</label>
                    <input
                      type="number"
                      name="seatingLimit"
                      value={event.seatingLimit}
                      onChange={handleChange}
                      className="field-input"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div className="field-group full-width">
                    <label className="field-label">הערות ופרטים נוספים</label>
                    <textarea
                      name="conditions"
                      value={event.conditions}
                      onChange={handleChange}
                      className="field-textarea"
                      rows="4"
                      placeholder="הוסף כל מידע נוסף הרלוונטי לאירוע... (48 שורות לפני האירוע)"
                    />
                  </div>
                </div>
              </div>

              {/* כפתורי פעולה */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <span>✓</span>
                  יצירת האירוע
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/דף בית')}
                  className="btn btn-secondary"
                >
                  <span>←</span>
                  חזור לדף הבית
                </button>
              </div>
            </form>
          </div>
        </div>
      <Slider />
    </div>
  );
}

export default NewEvent;