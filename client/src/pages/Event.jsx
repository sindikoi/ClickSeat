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
      alert("נוצר אירוע חדש");
    };
  

  return (
    <div className="wrapper">
      <div className="allPages">
        <Sliderup />
        <h2 className="event-title">יצירת אירוע </h2>
        <div className="event-form-container">
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
              <label>תאריך</label>
              <input type="date" name="date" value={event.date} onChange={handlechange} />
            </div>
            <div className="form-group">
              <label>שם האירוע </label>
              <input type="text" name="name" value={event.name} onChange={handlechange} />
            </div>
            <div className="form-group">
              <label>סוג האירוע </label>
              <input type="text" name="kind" value={event.kind} onChange={handlechange} />
            </div>
            <div className="form-group">
              <label>מיקום האירוע </label>
              <input type="text" name="place" value={event.place} onChange={handlechange} />
            </div>
            <div className="form-group">
              <label>מספר מוזמנים </label>
              <input
                type="number"
                name="numberOfGuests"
                value={event.numberOfGuests}
                onChange={handlechange}
              />
            </div>
            <div className="form-group">
              <label>פרטים נוספים </label>
              <textarea
                name="conditions"
                value={event.conditions}
                onChange={handlechange}
                rows="4"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-btn">יצירת אירוע</button>
              <button type="button" onClick={() => navigate("/דף בית")} className="home-btn">דף בית</button>
            </div>
          </form>
        </div>
      </div>
      <Slider />
    </div>
  );
}

export default Event;
