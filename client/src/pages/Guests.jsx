import React, { useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const groups = ['משפחה', 'חברים', 'צד כלה', 'צד חתן', 'עבודה'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newGuest.firstName && newGuest.lastName) {
      setIsSubmitting(true);
      
      // סימולציה של עיכוב קצר לאפקט ויזואלי
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const guest = {
        ...newGuest,
        id: Date.now(),
        rsvpStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setGuests(prev => [guest, ...prev]);
      setNewGuest({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        group: 'משפחה',
        plusOnes: 0,
        notes: ''
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // הסתרת הודעת ההצלחה אחרי 3 שניות
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleStatusChange = (guestId, newStatus) => {
    setGuests(prev => prev.map(guest => 
      guest.id === guestId 
        ? { ...guest, rsvpStatus: newStatus }
        : guest
    ));
  };

  const handleDeleteGuest = (guestId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האורח הזה?')) {
      setGuests(prev => prev.filter(guest => guest.id !== guestId));
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

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'אישר';
      case 'declined': return 'סירב';
      default: return 'לא הגיב';
    }
  };

  const getGroupIcon = (group) => {
    switch (group) {
      case 'משפחה': return '👨‍👩‍👧‍👦';
      case 'חברים': return '👥';
      case 'צד כלה': return '👰';
      case 'צד חתן': return '🤵';
      case 'עבודה': return '💼';
      default: return '👤';
    }
  };

  return (
    <div className="guests-page">
      <h1>🎉 ניהול אורחים</h1>
      
      {/* הודעת הצלחה */}
      {showSuccess && (
        <div className="success-message">
          <span>✅ האורח נוסף בהצלחה!</span>
        </div>
      )}
      
      {/* טופס הוספת אורח */}
      <div className="add-guest-form">
        <h2>➕ הוספת אורח חדש</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>שם פרטי</label>
              <input
                type="text"
                name="firstName"
                placeholder="הכנס שם פרטי"
                value={newGuest.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>שם משפחה</label>
              <input
                type="text"
                name="lastName"
                placeholder="הכנס שם משפחה"
                value={newGuest.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>מספר טלפון</label>
              <input
                type="tel"
                name="phone"
                placeholder="הכנס מספר טלפון"
                value={newGuest.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>אימייל</label>
              <input
                type="email"
                name="email"
                placeholder="הכנס כתובת אימייל"
                value={newGuest.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>קבוצה</label>
              <select
                name="group"
                value={newGuest.group}
                onChange={handleInputChange}
              >
                {groups.map(group => (
                  <option key={group} value={group}>
                    {getGroupIcon(group)} {group}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>מספר מלווים</label>
              <input
                type="number"
                name="plusOnes"
                placeholder="מספר מלווים"
                value={newGuest.plusOnes}
                onChange={handleInputChange}
                min="0"
                max="10"
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>הערות</label>
            <textarea
              name="notes"
              placeholder="הכנס הערות נוספות..."
              value={newGuest.notes}
              onChange={handleInputChange}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'loading' : ''}
          >
            {isSubmitting ? 'מוסיף...' : '➕ הוסף אורח'}
          </button>
        </form>
      </div>

      {/* חיפוש אורחים */}
      <div className="search-section">
        <h2>🔍 חיפוש אורחים</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="חפש לפי שם, טלפון או קבוצה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* רשימת אורחים */}
      <div className="guests-list">
        <h2>📋 רשימת אורחים ({filteredGuests.length})</h2>
        
        {filteredGuests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>אין אורחים להצגה</h3>
            <p>{searchTerm ? 'לא נמצאו אורחים התואמים לחיפוש שלך' : 'הוסף את האורח הראשון שלך!'}</p>
          </div>
        ) : (
          <div className="guests-grid">
            {filteredGuests.map(guest => (
              <div key={guest.id} className="guest-card">
                <div className="guest-header">
                  <div className="guest-name-group">
                    <h3>{guest.firstName} {guest.lastName}</h3>
                    <span className="group-badge">
                      {getGroupIcon(guest.group)} {guest.group}
                    </span>
                  </div>
                  <div className="guest-actions">
                    <span 
                      className={`status-badge ${getStatusColor(guest.rsvpStatus)}`}
                    >
                      {getStatusText(guest.rsvpStatus)}
                    </span>
                    <div className="status-buttons">
                      <button
                        className={`status-btn ${guest.rsvpStatus === 'confirmed' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(guest.id, 'confirmed')}
                        title="אישר"
                      >
                        ✅
                      </button>
                      <button
                        className={`status-btn ${guest.rsvpStatus === 'declined' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(guest.id, 'declined')}
                        title="סירב"
                      >
                        ❌
                      </button>
                      <button
                        className={`status-btn ${guest.rsvpStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(guest.id, 'pending')}
                        title="לא הגיב"
                      >
                        ⏳
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="guest-details">
                  {guest.phone && (
                    <p>
                      <strong>📞 טלפון:</strong> 
                      <a href={`tel:${guest.phone}`}>{guest.phone}</a>
                    </p>
                  )}
                  {guest.email && (
                    <p>
                      <strong>📧 אימייל:</strong> 
                      <a href={`mailto:${guest.email}`}>{guest.email}</a>
                    </p>
                  )}
                  <p>
                    <strong>👥 מלווים:</strong> 
                    {guest.plusOnes > 0 ? `${guest.plusOnes} אנשים` : 'ללא מלווים'}
                  </p>
                  {guest.notes && (
                    <p>
                      <strong>📝 הערות:</strong> 
                      {guest.notes}
                    </p>
                  )}
                  <p className="guest-date">
                    <strong>📅 נוסף ב:</strong> 
                    {new Date(guest.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
                
                <div className="guest-footer">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteGuest(guest.id)}
                    title="מחק אורח"
                  >
                    🗑️ מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests; 