import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch reservations
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/reservations/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete reservation');
        }

        // Refresh the reservations list
        fetchReservations();
        
      } catch (err) {
        alert('Error deleting reservation: ' + err.message);
      }
    }
  };

  const handleEdit = (reservation) => {
    // Navigate to reservation form with the reservation data
    navigate('/', { state: { editingReservation: reservation } });
  };

  if (loading) return <div className="min-h-screen bg-[#242424] p-8 text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#242424] p-8 text-white">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#242424] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Current Reservations</h2>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 flex items-center gap-2"
          >
            <span className="text-xl">←</span> Back
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {reservations.length === 0 ? (
            <p className="text-gray-600 italic">No reservations found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.customerEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Table {reservation.tableId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatTime(reservation.time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.partySize}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(reservation)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReservations;
