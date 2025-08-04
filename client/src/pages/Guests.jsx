import React, { useState, useEffect } from 'react';
import '../style/guests.css';
import Slider from '../components/Slider';
import Sliderup from '../components/Sliderup';

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
  const [selectedEvent, setSelectedEvent] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const groups = ['משפחה', 'חברים', 'צד כלה', 'צד חתן', 'עבודה'];
  
  // רשימת אירועים לדוגמה - אפשר להוסיף יותר
  const events = [
     ];

  // טעינת נתונים מ-localStorage בעת טעינת הקומפוננטה
  useEffect(() => {
    const savedGuests = localStorage.getItem('clickSeat_guests');
    if (savedGuests) {
      try {
        setGuests(JSON.parse(savedGuests));
      } catch (error) {
        console.error('שגיאה בטעינת נתונים מ-localStorage:', error);
      }
    }
  }, []);

  // שמירת נתונים ל-localStorage בכל פעם שהאורחים משתנים
  useEffect(() => {
    localStorage.setItem('clickSeat_guests', JSON.stringify(guests));
  }, [guests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newGuest.firstName && newGuest.lastName && selectedEvent) {
      setIsSubmitting(true);
      
      // סימולציה של עיכוב קצר לאפקט ויזואלי
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const guest = {
        ...newGuest,
        id: Date.now(),
        eventId: selectedEvent,
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
    } else {
      alert('אנא מלא את כל השדות הנדרשים ובחר אירוע');
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

  const handleClearAllData = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו לא ניתנת לביטול!')) {
      setGuests([]);
      localStorage.removeItem('clickSeat_guests');
      alert('כל הנתונים נמחקו בהצלחה!');
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(guests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clickSeat_guests_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // פילטור אורחים לפי חיפוש, אירוע וסטטוס
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      guest.group.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent ? guest.eventId === selectedEvent : true;
    
    const matchesStatus = statusFilter === 'all' ? true : guest.rsvpStatus === statusFilter;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

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

  const getEventName = (eventId) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'אירוע לא ידוע';
  };

  // סטטיסטיקות
  const totalGuests = guests.filter(g => selectedEvent ? g.eventId === selectedEvent : true).length;
  const confirmedGuests = guests.filter(g => 
    g.rsvpStatus === 'confirmed' && (selectedEvent ? g.eventId === selectedEvent : true)
  ).length;
  const declinedGuests = guests.filter(g => 
    g.rsvpStatus === 'declined' && (selectedEvent ? g.eventId === selectedEvent : true)
  ).length;
  const pendingGuests = guests.filter(g => 
    g.rsvpStatus === 'pending' && (selectedEvent ? g.eventId === selectedEvent : true)
  ).length;

  return (
    <div className="wrapper">
      <div className="allPages">
        <Sliderup />
        <div className="guests-page">
      <h1>🎉 ניהול אורחים</h1>
      
      {/* כפתורי ניהול נתונים */}
      {guests.length > 0 && (
        <div className="data-management">
          <div className="management-buttons">
            <button 
              className="export-btn"
              onClick={handleExportData}
              title="ייצא נתונים לקובץ JSON"
            >
              📥 ייצא נתונים
            </button>
            <button 
              className="clear-btn"
              onClick={handleClearAllData}
              title="מחק את כל הנתונים"
            >
              🗑️ מחק כל הנתונים
            </button>
          </div>
        </div>
      )}
      
      {/* בחירת אירוע */}
      <div className="event-selector">
        <h2>📅 בחירת אירוע</h2>
        <select 
          value={selectedEvent} 
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="event-select"
        >
          <option value="">בחר אירוע...</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
        
        {selectedEvent && (
          <div className="event-stats">
            <div className="stat-item">
              <span className="stat-number">{totalGuests}</span>
              <span className="stat-label">סה"כ אורחים</span>
            </div>
            <div className="stat-item confirmed">
              <span className="stat-number">{confirmedGuests}</span>
              <span className="stat-label">אישרו הגעה</span>
            </div>
            <div className="stat-item declined">
              <span className="stat-number">{declinedGuests}</span>
              <span className="stat-label">לא אישרו</span>
            </div>
            <div className="stat-item pending">
              <span className="stat-number">{pendingGuests}</span>
              <span className="stat-label">לא הגיבו</span>
            </div>
          </div>
        )}
      </div>
      
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
              <label>אימייל</label>
              <input
                type="email"
                name="email"
                placeholder="הכנס כתובת אימייל"
                value={newGuest.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>מספר טלפון</label>
              <input
                type="tel"
                name="phone"
                placeholder="מספר טלפון הכנס"
                value={newGuest.phone}
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
              <label>מספר אנשים</label>
              <input
                type="number"
                name="plusOnes"
                placeholder="מספר אנשים"
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
            disabled={isSubmitting || !selectedEvent}
            className={isSubmitting ? 'loading' : ''}
          >
            {isSubmitting ? 'מוסיף...' : '➕ הוסף אורח'}
          </button>
        </form>
      </div>

      {/* חיפוש ופילטרים */}
      <div className="search-section">
        <h2>🔍 חיפוש ופילטרים</h2>
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
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            כל האורחים ({totalGuests})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            אישרו הגעה ({confirmedGuests})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'declined' ? 'active' : ''}`}
            onClick={() => setStatusFilter('declined')}
          >
            לא אישרו ({declinedGuests})
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            לא הגיבו ({pendingGuests})
          </button>
        </div>
      </div>

      {/* רשימת אורחים */}
      <div className="guests-list">
        <h2>📋 רשימת אורחים ({filteredGuests.length})</h2>
        
        {filteredGuests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>אין אורחים להצגה</h3>
            <p>{searchTerm || statusFilter !== 'all' ? 'לא נמצאו אורחים התואמים לפילטרים שלך' : 'הוסף את האורח הראשון שלך!'}</p>
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
                    <span className="event-badge">
                      📅 {getEventName(guest.eventId)}
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
                    <strong>👥 מספר אנשים:</strong> 
                    {guest.plusOnes > 0 ? `${guest.plusOnes} אנשים` : 'אדם אחד'}
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
      </div>
      <Slider />
    </div>
  );
};

export default Guests; 