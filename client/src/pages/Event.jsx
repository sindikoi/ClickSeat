import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../style/pages.css"
import Slider from "../components/Slider";
import Sliderup from "../components/Sliderup";

function Event() {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    date: "",
    name: "",
    kind: "",
    place: "",
    numberOfGuests: "",
    seatingLimit: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    conditions: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: value,
    }))
};

    const handleSubmit = (e) => {
      e.preventDefault();
      
      console.log('יוצר אירוע חדש...');
      
      // יצירת אירוע חדש עם כל הפרטים
      const newEvent = {
        date: event.date.split('-').reverse().join('-'), // הפיכת התאריך ל-DD-MM-YYYY
        name: event.name,
        kind: event.kind,
        place: event.place,
        numberofGuests: event.numberOfGuests,
        seatingLimit: event.seatingLimit,
        ownerName: event.ownerName,
        ownerPhone: event.ownerPhone,
        ownerEmail: event.ownerEmail,
        condition: event.conditions || "פעיל",
        id: Date.now() // מזהה ייחודי
      };

      console.log('האירוע החדש:', newEvent);

      // טעינת אירועים קיימים
      const existingEvents = JSON.parse(localStorage.getItem('clickSeat_events') || '[]');
      console.log('אירועים קיימים:', existingEvents);
      
      // הוספת האירוע החדש
      const updatedEvents = [...existingEvents, newEvent];
      console.log('כל האירועים אחרי הוספה:', updatedEvents);
      
      // שמירה בlocalStorage
      localStorage.setItem('clickSeat_events', JSON.stringify(updatedEvents));
      console.log('האירועים נשמרו ב-localStorage:', updatedEvents);
      
      // שליחת אירוע כדי לעדכן את הלוח שנה
      window.dispatchEvent(new Event('storage'));
      
      alert("נוצר אירוע חדש בהצלחה!");
      navigate("/דף בית");
    };
  

  return (
    <div className="wrapper">
      <div className="allPages">
        <Sliderup />
        <h2 className="event-title">יצירת אירוע </h2>
        <div className="event-form-container">
          <form onSubmit={handleSubmit} className="event-form">
            {/* פרטי בעל האירוע */}
            <div className="form-section">
              <h3>פרטי בעל האירוע</h3>
              <div className="form-group">
                <label>*שם בעל האירוע (שם מלא)</label>
                <input type="text" name="ownerName" value={event.ownerName} onChange={handlechange} required />
              </div>
              <div className="form-group">
                <label>*פלאפון (נייד)</label>
                <input type="tel" name="ownerPhone" value={event.ownerPhone} onChange={handlechange} required />
              </div>
              <div className="form-group">
                <label>*אימייל</label>
                <input type="email" name="ownerEmail" value={event.ownerEmail} onChange={handlechange} required />
              </div>
            </div>

            {/* פרטי האירוע */}
            <div className="form-section">
              <h3>פרטי האירוע</h3>
              <div className="form-group">
                <label>*שם האירוע</label>
                <input type="text" name="name" value={event.name} onChange={handlechange} required />
              </div>
              <div className="form-group">
                <label>סוג אירוע</label>
                <select name="kind" value={event.kind} onChange={handlechange} required>
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
                <label>אולם</label>
                <select name="place" value={event.place} onChange={handlechange} required>
                  <option value="">בחר</option>
                  <option value="אולם ראשי">אולם ראשי</option>
                  <option value="אולם משני">אולם משני</option>
                  <option value="גן אירועים">גן אירועים</option>
                  <option value="מסעדה">מסעדה</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>
              <div className="form-group">
                <label>*תאריך האירוע</label>
                <input type="datetime-local" name="date" value={event.date} onChange={handlechange} required />
              </div>
              <div className="form-group">
                <label>*מספר אורחים</label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={event.numberOfGuests}
                  onChange={handlechange}
                  required
                />
              </div>
              <div className="form-group">
                <label>הגבלת כמות אורחים להושבה</label>
                <input
                  type="number"
                  name="seatingLimit"
                  value={event.seatingLimit}
                  onChange={handlechange}
                />
              </div>
              <div className="form-group full-width">
                <label>פרטים נוספים</label>
                <textarea
                  name="conditions"
                  value={event.conditions}
                  onChange={handlechange}
                  rows="4"
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-btn">יצירת אירוע</button>
              <button type="button" onClick={() => navigate(-1)} className="home-btn">חזור לדף הקודם</button>
            </div>
          </form>
        </div>
      </div>
      <Slider />
    </div>
  );
}

export default Event;
