import React, { useState } from 'react';
import '../style/guests.css';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    group: 'משפחה',
    plusOnes: 0,
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const groups = ['משפחה', 'חברים', 'צד כלה', 'צד חתן', 'עבודה'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newGuest.firstName && newGuest.lastName) {
      const guest = {
        ...newGuest,
        id: Date.now(),
        rsvpStatus: 'pending'
      };
      setGuests(prev => [...prev, guest]);
      setNewGuest({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        group: 'משפחה',
        plusOnes: 0,
        notes: ''
      });
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm) ||
    guest.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'declined': return 'red';
      default: return 'orange';
    }
  };

  return (
    <div className="guests-page">
      <h1>ניהול אורחים</h1>
      
      {/* טופס הוספת אורח */}
      <div className="add-guest-form">
        <h2>הוספת אורח חדש</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="שם פרטי"
              value={newGuest.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="שם משפחה"
              value={newGuest.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <input
              type="tel"
              name="phone"
              placeholder="מספר טלפון"
              value={newGuest.phone}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={newGuest.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <select
              name="group"
              value={newGuest.group}
              onChange={handleInputChange}
            >
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <input
              type="number"
              name="plusOnes"
              placeholder="מספר מלווים"
              value={newGuest.plusOnes}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          
          <textarea
            name="notes"
            placeholder="הערות"
            value={newGuest.notes}
            onChange={handleInputChange}
          />
          
          <button type="submit">הוסף אורח</button>
        </form>
      </div>

      {/* חיפוש אורחים */}
      <div className="search-section">
        <h2>חיפוש אורחים</h2>
        <input
          type="text"
          placeholder="חפש לפי שם, טלפון או קבוצה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* רשימת אורחים */}
      <div className="guests-list">
        <h2>רשימת אורחים ({filteredGuests.length})</h2>
        <div className="guests-grid">
          {filteredGuests.map(guest => (
            <div key={guest.id} className="guest-card">
              <div className="guest-header">
                <h3>{guest.firstName} {guest.lastName}</h3>
                <span 
                  className={`status-badge ${getStatusColor(guest.rsvpStatus)}`}
                >
                  {guest.rsvpStatus === 'confirmed' ? 'אישר' : 
                   guest.rsvpStatus === 'declined' ? 'סירב' : 'לא הגיב'}
                </span>
              </div>
              <div className="guest-details">
                <p><strong>טלפון:</strong> {guest.phone || 'לא צוין'}</p>
                <p><strong>אימייל:</strong> {guest.email || 'לא צוין'}</p>
                <p><strong>קבוצה:</strong> {guest.group}</p>
                <p><strong>מלווים:</strong> {guest.plusOnes}</p>
                {guest.notes && <p><strong>הערות:</strong> {guest.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guests; 