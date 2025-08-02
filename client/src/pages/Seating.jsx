import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/seating.css';

const Seating = () => {
  const navigate = useNavigate();
  
  const [tables, setTables] = useState([
    { id: 1, name: 'שולחן 1', capacity: 8, guests: [], position: { x: 100, y: 100 } },
    { id: 2, name: 'שולחן 2', capacity: 8, guests: [], position: { x: 300, y: 100 } },
    { id: 3, name: 'שולחן 3', capacity: 6, guests: [], position: { x: 500, y: 100 } },
  ]);

  const [showAddTable, setShowAddTable] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [newTable, setNewTable] = useState({
    name: '',
    capacity: 8,
    capacityType: 'custom', // custom או preset
    tableType: 'round', // round, rectangle, oval
    position: { x: 200, y: 200 }
  });

  const [guests, setGuests] = useState([]);

  const [selectedGuest, setSelectedGuest] = useState(null);
  const [draggedGuest, setDraggedGuest] = useState(null);

  const handleGuestDragStart = (e, guest) => {
    setDraggedGuest(guest);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTableDrop = (e, table) => {
    e.preventDefault();
    if (draggedGuest && table.guests.length < table.capacity) {
      // הסרת האורח מהשולחן הקודם
      setTables(prevTables => 
        prevTables.map(t => ({
          ...t,
          guests: t.guests.filter(g => g.id !== draggedGuest.id)
        }))
      );

      // הוספת האורח לשולחן החדש
      setTables(prevTables =>
        prevTables.map(t =>
          t.id === table.id
            ? { ...t, guests: [...t.guests, draggedGuest] }
            : t
        )
      );
    }
    setDraggedGuest(null);
  };

  const handleTableDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddTable = () => {
    if (newTable.name.trim()) {
      const table = {
        ...newTable,
        id: Date.now(),
        guests: []
      };
      setTables(prev => [...prev, table]);
      setNewTable({ 
        name: '', 
        capacity: 8, 
        capacityType: 'custom',
        tableType: 'round',
        position: { x: 200, y: 200 } 
      });
      setShowAddTable(false);
    }
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setNewTable({
      name: table.name,
      capacity: table.capacity,
      capacityType: table.capacity >= 2 && table.capacity <= 20 ? 'preset' : 'custom',
      tableType: table.tableType || 'round',
      position: table.position
    });
    setShowAddTable(true);
  };

  const handleUpdateTable = () => {
    if (newTable.name.trim() && editingTable) {
      setTables(prev => 
        prev.map(table => 
          table.id === editingTable.id 
            ? { ...table, ...newTable }
            : table
        )
      );
      setNewTable({ 
        name: '', 
        capacity: 8, 
        capacityType: 'custom',
        tableType: 'round',
        position: { x: 200, y: 200 } 
      });
      setEditingTable(null);
      setShowAddTable(false);
    }
  };

  const handleDeleteTable = (tableId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את השולחן?')) {
      setTables(prev => prev.filter(table => table.id !== tableId));
    }
  };

  const handleTableMove = (tableId, newPosition) => {
    setTables(prev => 
      prev.map(table => 
        table.id === tableId 
          ? { ...table, position: newPosition }
          : table
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'declined': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const getGroupColor = (group) => {
    switch (group) {
      case 'משפחה': return '#007bff';
      case 'חברים': return '#6f42c1';
      case 'צד כלה': return '#e83e8c';
      case 'צד חתן': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  return (
    <div className="seating-page">
      <h1>מערכת הושבה</h1>
      
      <div className="seating-container">
        {/* רשימת אורחים */}
        <div className="guests-panel">
          <h2>רשימת אורחים</h2>
          <div className="guests-list">
            {guests.length === 0 ? (
              <div className="no-guests-message">
                <p>אין אורחים במערכת</p>
                <p>הוסף אורחים בדף "ניהול אורחים"</p>
                <button 
                  className="add-guests-btn"
                  onClick={() => navigate('/אורחים')}
                >
                  הוסף אורחים
                </button>
              </div>
            ) : (
              guests.map(guest => {
                const isSeated = tables.some(table => 
                  table.guests.some(g => g.id === guest.id)
                );
                
                return (
                  <div
                    key={guest.id}
                    className={`guest-item ${isSeated ? 'seated' : ''}`}
                    draggable={!isSeated}
                    onDragStart={(e) => handleGuestDragStart(e, guest)}
                  >
                    <div className="guest-info">
                      <span className="guest-name">{guest.name}</span>
                      <span 
                        className="guest-group"
                        style={{ backgroundColor: getGroupColor(guest.group) }}
                      >
                        {guest.group}
                      </span>
                    </div>
                    <div 
                      className="guest-status"
                      style={{ backgroundColor: getStatusColor(guest.rsvpStatus) }}
                    >
                      {guest.rsvpStatus === 'confirmed' ? 'אישר' : 
                       guest.rsvpStatus === 'declined' ? 'סירב' : 'לא הגיב'}
                    </div>
                    {isSeated && <span className="seated-indicator">✓ הושב</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* מפת האולם */}
        <div className="venue-map">
          <div className="map-header">
            <h2>מפת האולם</h2>
            <button 
              className="add-table-btn"
              onClick={() => setShowAddTable(true)}
            >
              + הוסף שולחן
            </button>
          </div>
          
          {/* טופס הוספת/עריכת שולחן */}
          {showAddTable && (
            <div className="add-table-form">
              <h3>{editingTable ? 'עריכת שולחן' : 'הוספת שולחן חדש'}</h3>
              
              {/* שם השולחן */}
              <div className="form-group">
                <label>שם השולחן</label>
                <input
                  type="text"
                  placeholder="למשל: שולחן VIP, שולחן משפחה"
                  value={newTable.name}
                  onChange={(e) => setNewTable(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* סוג השולחן */}
              <div className="form-group">
                <label>סוג השולחן</label>
                <select
                  value={newTable.tableType}
                  onChange={(e) => setNewTable(prev => ({ ...prev, tableType: e.target.value }))}
                >
                  <option value="round">עגול</option>
                  <option value="rectangle">מלבני</option>
                  <option value="oval">אובלי</option>
                </select>
              </div>

              {/* מספר מקומות */}
              <div className="form-group">
                <label>מספר מקומות</label>
                <div className="capacity-options">
                  <div className="capacity-type">
                    <label>
                      <input
                        type="radio"
                        name="capacityType"
                        value="preset"
                        checked={newTable.capacityType === 'preset'}
                        onChange={(e) => setNewTable(prev => ({ 
                          ...prev, 
                          capacityType: e.target.value,
                          capacity: 8 
                        }))}
                      />
                      בחירה מהירה
                    </label>
                    {newTable.capacityType === 'preset' && (
                      <select
                        value={newTable.capacity}
                        onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      >
                        <option value={2}>2 מקומות</option>
                        <option value={4}>4 מקומות</option>
                        <option value={6}>6 מקומות</option>
                        <option value={8}>8 מקומות</option>
                        <option value={10}>10 מקומות</option>
                        <option value={12}>12 מקומות</option>
                        <option value={15}>15 מקומות</option>
                        <option value={20}>20 מקומות</option>
                      </select>
                    )}
                  </div>
                  
                  <div className="capacity-type">
                    <label>
                      <input
                        type="radio"
                        name="capacityType"
                        value="custom"
                        checked={newTable.capacityType === 'custom'}
                        onChange={(e) => setNewTable(prev => ({ 
                          ...prev, 
                          capacityType: e.target.value,
                          capacity: 8 
                        }))}
                      />
                      מספר מותאם אישית
                    </label>
                    {newTable.capacityType === 'custom' && (
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={newTable.capacity}
                        onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                        placeholder="הכנס מספר"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                <button 
                  onClick={editingTable ? handleUpdateTable : handleAddTable} 
                  className="save-btn"
                >
                  {editingTable ? 'עדכן' : 'שמור'}
                </button>
                <button 
                  onClick={() => {
                    setShowAddTable(false);
                    setEditingTable(null);
                    setNewTable({ 
                      name: '', 
                      capacity: 8, 
                      capacityType: 'custom',
                      tableType: 'round',
                      position: { x: 200, y: 200 } 
                    });
                  }} 
                  className="cancel-btn"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
          
          <div className="map-container">
            {tables.map(table => (
                              <div
                  key={table.id}
                  className={`table table-${table.tableType || 'round'}`}
                  style={{
                    left: table.position.x,
                    top: table.position.y,
                    backgroundColor: table.guests.length >= table.capacity ? '#dc3545' : '#28a745'
                  }}
                  onDrop={(e) => handleTableDrop(e, table)}
                  onDragOver={handleTableDragOver}
                >
                <div className="table-header">
                  <span className="table-name">{table.name}</span>
                  <span className="table-capacity">
                    {table.guests.length}/{table.capacity}
                  </span>
                  <div className="table-actions">
                    <button 
                      className="edit-table-btn"
                      onClick={() => handleEditTable(table)}
                      title="ערוך שולחן"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-table-btn"
                      onClick={() => handleDeleteTable(table.id)}
                      title="מחק שולחן"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="table-guests">
                  {table.guests.map(guest => (
                    <div key={guest.id} className="table-guest">
                      {guest.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* סטטיסטיקות */}
      <div className="seating-stats">
        <h2>סטטיסטיקות הושבה</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>סה"כ אורחים</h3>
            <span className="stat-number">{guests.length}</span>
          </div>
          <div className="stat-card">
            <h3>הושבו</h3>
            <span className="stat-number">
              {guests.filter(guest => 
                tables.some(table => table.guests.some(g => g.id === guest.id))
              ).length}
            </span>
          </div>
          <div className="stat-card">
            <h3>לא הושבו</h3>
            <span className="stat-number">
              {guests.filter(guest => 
                !tables.some(table => table.guests.some(g => g.id === guest.id))
              ).length}
            </span>
          </div>
          <div className="stat-card">
            <h3>שולחנות</h3>
            <span className="stat-number">{tables.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seating; 