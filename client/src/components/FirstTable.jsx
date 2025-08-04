import { useReactTable } from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import "../style/tables.css";
import { useNavigate } from 'react-router-dom';

function FirstTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isOpen, setOpen] = useState(null);
  const [isEdit, setEdit] = useState(null);

  // טעינת אירועים מlocalStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('clickSeat_events');
    if (savedEvents) {
      try {
        setData(JSON.parse(savedEvents));
      } catch (error) {
        console.error('שגיאה בטעינת אירועים:', error);
      }
    }
  }, []);

  // שמירת אירועים לlocalStorage
  useEffect(() => {
    localStorage.setItem('clickSeat_events', JSON.stringify(data));
  }, [data]);

  const createEvent = () => {
    navigate('/אירוע')
  }

  const columns = [
    { header: "מצב האירוע ", accessorKey: "condition" },
    { header: "מספר אורחים", accessorKey: "numberofGuests" },
    { header: "אולם ", accessorKey: "place" },
    { header: "סוג האירוע ", accessorKey: "kind" },
    { header: "שם האירוע", accessorKey: "name" },
    { header: "תאריך", accessorKey: "date" },
  ];

  const tableItem = useReactTable({ data, columns });

  const editData = (rowIndex, columnIndex) => {
    setEdit({rowIndex, columnIndex});
  }

  const saveEdit = (rowIndex, columnKey, value) => {
      const newData =[...data];
      newData[rowIndex][columnKey] = value;
      setData(newData);
      setEdit(null);
  }

  const menuoButtom = (rowIndex) => {
    if ( isOpen === rowIndex) {
        setOpen(null);
    }
    else{
        setOpen(rowIndex);
    }
  }

  const deleteRow = (rowIndex) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האירוע הזה?')) {
      const newData = data.filter((_, index) => index !== rowIndex);
      setData(newData);
      setOpen(null);
    }
  }

  const viewEventDetails = (rowIndex) => {
    const event = data[rowIndex];
    console.log('פרטי האירוע:', event);
    // כאן אפשר להוסיף ניווט לעמוד פרטי האירוע
    navigate(`/פרטי-אירוע/${rowIndex}`);
  }

  const editEvent = (rowIndex) => {
    const event = data[rowIndex];
    console.log('עריכת האירוע:', event);
    // כאן אפשר להוסיף ניווט לעמוד עריכת האירוע
    navigate(`/עריכת-אירוע/${rowIndex}`);
  }

  const viewEventStatus = (rowIndex) => {
    const event = data[rowIndex];
    console.log('סטטוס האירוע:', event);
    // כאן אפשר להוסיף ניווט לעמוד סטטוס האירוע
    navigate(`/סטטוס-אירוע/${rowIndex}`);
  }

  const viewSeatingMap = (rowIndex) => {
    const event = data[rowIndex];
    console.log('מפת הישיבה:', event);
    navigate('/הושבה');
  }

  const viewGuests = (rowIndex) => {
    const event = data[rowIndex];
    console.log('אורחי האירוע:', event);
    navigate('/אורחים');
  }

  return (
    <div className="box">
        <p className="title">האירועים שלך</p>
    <div>
      <button
        className="addRow"
        onClick={createEvent}
      >
        ➕ הוספת אירוע
      </button>

      <div className="tableFirst">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key ={index}> {column.header}</th>
              ))}
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {data.length == 0 ? (
              <tr>
                <td colSpan={columns.length + 1}> אין נתונים להצגה</td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      {isEdit?.rowIndex === rowIndex && isEdit?.columnIndex === columnIndex ? (
                        <input
                          value={row[column.accessorKey] || ''}
                          onChange={(e) => saveEdit(rowIndex, column.accessorKey, e.target.value)}
                          onBlur={() => setEdit(null)}
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => editData(rowIndex, columnIndex)}>
                          {row[column.accessorKey] || ''}
                        </span>
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn primary"
                        onClick={() => viewEventDetails(rowIndex)}
                        title="פרטי האירוע"
                      >
                        👁️ פרטים
                      </button>
                      
                      <button 
                        className="action-btn secondary"
                        onClick={() => menuoButtom(rowIndex)}
                        title="אפשרויות נוספות"
                      >
                        ⚙️
                      </button>
                      
                      {isOpen === rowIndex && (
                        <div className="dropdown-menu">
                          <button 
                            className="dropdown-item"
                            onClick={() => editEvent(rowIndex)}
                          >
                            ✏️ עריכת אירוע
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => viewEventStatus(rowIndex)}
                          >
                            📊 סטטוס אירוע
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => viewGuests(rowIndex)}
                          >
                            👥 ניהול אורחים
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => viewSeatingMap(rowIndex)}
                          >
                            🪑 מפת הישיבה
                          </button>
                          <button 
                            className="dropdown-item danger"
                            onClick={() => deleteRow(rowIndex)}
                          >
                            🗑️ מחיקה
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default FirstTable;
