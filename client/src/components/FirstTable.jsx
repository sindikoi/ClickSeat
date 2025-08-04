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
    const loadEvents = () => {
      const savedEvents = localStorage.getItem('clickSeat_events');
      
      if (savedEvents) {
        try {
          const eventsData = JSON.parse(savedEvents);
          setData(eventsData);
        } catch (error) {
          console.error('שגיאה בטעינת אירועים:', error);
        }
      }
    };

    loadEvents();

    // האזנה לשינויים ב-localStorage
    const handleStorageChange = () => {
      loadEvents();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // שמירת אירועים לlocalStorage (רק אם יש שינויים ידניים בטבלה)
  // useEffect(() => {
  //   if (data.length > 0) {
  //     localStorage.setItem('clickSeat_events', JSON.stringify(data));
  //   }
  // }, [data]);

  const createEvent = () => {
    navigate('/אירוע')
  }

  const columns = [
    { header: "מצב האירוע", accessorKey: "condition" },
    { header: "מספר אורחים", accessorKey: "numberofGuests" },
    { header: "אולם", accessorKey: "place" },
    { header: "סוג האירוע", accessorKey: "kind" },
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
      
      // עדכון localStorage אחרי המחיקה
      localStorage.setItem('clickSeat_events', JSON.stringify(newData));
      
      // שליחת אירוע כדי לעדכן את הלוח שנה
      window.dispatchEvent(new Event('storage'));
    }
  }

  const viewEventDetails = (rowIndex) => {
    const event = data[rowIndex];
    // כאן אפשר להוסיף ניווט לעמוד פרטי האירוע
    navigate(`/פרטי-אירוע/${rowIndex}`);
  }

  const editEvent = (rowIndex) => {
    const event = data[rowIndex];
    // כאן אפשר להוסיף ניווט לעמוד עריכת האירוע
    navigate(`/עריכת-אירוע/${rowIndex}`);
  }

  const viewEventStatus = (rowIndex) => {
    const event = data[rowIndex];
    console.log('מעביר אירוע לסטטוס:', event);
    console.log('ID של האירוע:', event.id);
    // ניווט לעמוד סטטוס האירוע עם ה-ID הייחודי
    navigate(`/סטטוס-אירוע/${event.id}`);
  }

  const viewSeatingMap = (rowIndex) => {
    const event = data[rowIndex];
    navigate('/הושבה');
  }

  const viewGuests = (rowIndex) => {
    const event = data[rowIndex];
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
                                               {column.accessorKey === "condition" ? (
                          // כפתור מצב האירוע עם תפריט נפתח
                          <div className="status-dropdown">
                            <button 
                              className="status-btn"
                              onClick={() => menuoButtom(rowIndex)}
                              title="אפשרויות האירוע"
                            >
                                                             ⚙️ פעולות
                            </button>
                            {isOpen === rowIndex && (
                              <div className="status-menu">
                                <button 
                                  className="status-menu-item"
                                  onClick={() => editEvent(rowIndex)}
                                >
                                  ✏️ עריכה
                                </button>
                                <button 
                                  className="status-menu-item"
                                  onClick={() => viewEventStatus(rowIndex)}
                                >
                                  📊 סטטוס
                                </button>
                                <button 
                                  className="status-menu-item danger"
                                  onClick={() => deleteRow(rowIndex)}
                                >
                                  🗑️ מחיקה
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                         // שאר העמודות - עריכה רגילה
                         isEdit?.rowIndex === rowIndex && isEdit?.columnIndex === columnIndex ? (
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
                         )
                       )}
                     </td>
                   ))}
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
