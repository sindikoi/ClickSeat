import { useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import "../style/tables.css";

function FirstTable() {
  const columns = [
    { header: "מצב האירוע ", accessorKey: "condition" },
    { header: "מספר אורחים", accessorKey: "numberofGuests" },
    { header: "אולם ", accessorKey: "place" },
    { header: "סוג האירוע ", accessorKey: "kind" },
    { header: "שם האירוע", accessorKey: "name" },
    { header: "תאריך", accessorKey: "date" },
  ];

  const [data, setData] = useState([]);

  const tableItem = useReactTable({ data, columns });

  const [isOpen, setOpen] = useState(null);

  const [isEdit, setEdit] = useState(null);

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
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    setOpen(null); // Close the dropdown after deleting
  }

  return (
    <div>
      <button
        className="addRow"
        onClick={() =>
          setData([
            ...data,
            {
              date: "",
              name: "",
              kind: "",
              place: "",
              numberofGuests: "",
              condition: "",
            },
          ])
        }
      >
        הוספת אירוע
      </button>

      <div className="tableFirst">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th> {column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length == 0 ? (
              <tr>
                <td colSpan={columns.length}> אין נתונים להצגה</td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      {column.accessorKey === "condition" ? (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          position: 'relative'
                        }}>
                          {isEdit?.rowIndex === rowIndex && isEdit?.columnIndex === columnIndex ? (
                            <input
                              value={row[column.accessorKey]}
                              onChange={(e) => saveEdit(rowIndex, column.accessorKey, e.target.value)}
                              onBlur={() => setEdit(null)}
                              autoFocus
                            />
                          ) : (
                            <span onClick={() => editData(rowIndex, columnIndex)}>
                              {row[column.accessorKey]}
                            </span>
                          )}
                          
                          <button onClick={() => menuoButtom(rowIndex)}>
                            <span>▼</span>
                            <span>⋮</span>
                          </button>
                          {isOpen === rowIndex && (
                            <div className="menua-dowm">
                              <button onClick={() => editData(rowIndex, columnIndex)}
                                >סטטוס אורחים</button>
                              <button>מפת אולם</button>
                              <button onClick={() => deleteRow(rowIndex)}>מחיקה</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Add editing logic to ALL other columns
                        isEdit?.rowIndex === rowIndex && isEdit?.columnIndex === columnIndex ? (
                          <input
                            value={row[column.accessorKey]}
                            onChange={(e) => saveEdit(rowIndex, column.accessorKey, e.target.value)}
                            onBlur={() => setEdit(null)}
                            autoFocus
                          />
                        ) : (
                          <span onClick={() => editData(rowIndex, columnIndex)}>
                            {row[column.accessorKey]}
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
  );
}

export default FirstTable;
