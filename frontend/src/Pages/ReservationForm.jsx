// ReservationForm.jsx
import React, { useState, useEffect } from "react";


const ReservationForm = ({ editingReservation, onSubmit, tables }) => {
  // If editingReservation exists, we’re in edit mode
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    date: "",
    time: "",
    partySize: "",
    tableId: ""
  });

  const editingId = editingReservation ? editingReservation.id : null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editingId); // Pass data to parent handler
    if (!editingId) {
      // Reset form after adding a new reservation
      setFormData({
        customerName: "",
        customerEmail: "",
        date: "",
        time: "",
        partySize: "",
        tableId: ""
      });
    }
  };



  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md min-h-screen text-gray-900 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        {editingId ? "Edit Reservation" : "Add Reservation"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-10">
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
              <option key={table.id} value={table.id}>
                {table.location} (Capacity: {table.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          {editingId && (
            <button
              type="button"
              onClick={() => setFormData({
                customerName: "",
                customerEmail: "",
                date: "",
                time: "",
                partySize: "",
                tableId: ""
              })}
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
