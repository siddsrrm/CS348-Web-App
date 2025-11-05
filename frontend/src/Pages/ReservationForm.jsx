// ReservationForm.jsx
import React, { useState, useEffect } from "react";

const ReservationForm = ({ editingReservation, onSubmit }) => {
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    date: "",
    time: "",
    partySize: "",
    tableId: ""
  });

  const editingId = editingReservation ? editingReservation.id : null;

    // Fetch available tables whenever date or time changes
  useEffect(() => {
    const fetchTables = async () => {
      try {
        // Only fetch available tables if both date and time are selected
        if (formData.date && formData.time) {
          const res = await fetch(
            `http://127.0.0.1:5000/api/tables?date=${formData.date}&time=${formData.time}`
          );
          const data = await res.json();
          
          if (data.error) {
            console.error("Error:", data.error);
            return;
          }
          
          setTables(data);
        }
      } catch (err) {
        console.error("Error fetching tables:", err);
      }
    };
    fetchTables();
  }, [formData.date, formData.time]);

  // Populate form if editing
  useEffect(() => {
    if (editingReservation) {
      setFormData({
        customerName: editingReservation.customerName,
        customerEmail: editingReservation.customerEmail,
        date: editingReservation.date,
        time: editingReservation.time,
        partySize: editingReservation.partySize,
        tableId: editingReservation.tableId
      });
    }
  }, [editingReservation]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        onSubmit(formData, editingId);
      } else {
        const response = await fetch('http://127.0.0.1:5000/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create reservation');
        }

        const result = await response.json();
        console.log('Reservation created:', result);
        
        // Reset form
        setFormData({
          customerName: "",
          customerEmail: "",
          date: "",
          time: "",
          partySize: "",
          tableId: ""
        });

        // You might want to show a success message to the user
        alert('Reservation created successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating reservation: ' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md min-h-screen text-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        {editingId ? "Edit Reservation" : "Add Reservation"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-sm font-medium">Customer Email</label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Party Size */}
        <div>
          <label className="block text-sm font-medium">Party Size</label>
          <input
            type="number"
            name="partySize"
            value={formData.partySize}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min={1}
            required
          />
        </div>

        {/* Table selection */}
        <div>
          <label className="block text-sm font-medium">Table</label>
          <select
            name="tableId"
            value={formData.tableId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                Table {table.table_id} (Capacity: {table.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          {editingId && (
            <button
              type="button"
              onClick={() =>
                setFormData({
                  customerName: "",
                  customerEmail: "",
                  date: "",
                  time: "",
                  partySize: "",
                  tableId: ""
                })
              }
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? "Update Reservation" : "Add Reservation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
