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
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });
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
      setFilteredReservations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters whenever filters or reservations change
  useEffect(() => {
    let filtered = [...reservations];
    
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(res => {
        const reservationDate = res.date;
        
        if (filters.startDate && filters.endDate) {
          // Check if date is within range
          return reservationDate >= filters.startDate && reservationDate <= filters.endDate;
        } else if (filters.startDate) {
          // Check if date is after start date
          return reservationDate >= filters.startDate;
        } else if (filters.endDate) {
          // Check if date is before end date
          return reservationDate <= filters.endDate;
        }
        return true;
      });
    }
    
    if (filters.startTime || filters.endTime) {
      filtered = filtered.filter(res => {
        const reservationTime = res.time;
        
        if (filters.startTime && filters.endTime) {
          // Check if time is within range
          return reservationTime >= filters.startTime && reservationTime <= filters.endTime;
        } else if (filters.startTime) {
          // Check if time is after start time
          return reservationTime >= filters.startTime;
        } else if (filters.endTime) {
          // Check if time is before end time
          return reservationTime <= filters.endTime;
        }
        return true;
      });
    }
    
    setFilteredReservations(filtered);
  }, [filters, reservations]);

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

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="flex-1 border border-gray-300 rounded-md p-2"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="flex-1 border border-gray-300 rounded-md p-2"
                placeholder="End Date"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="time"
                name="startTime"
                value={filters.startTime}
                onChange={handleFilterChange}
                className="flex-1 border border-gray-300 rounded-md p-2"
                placeholder="Start Time"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                name="endTime"
                value={filters.endTime}
                onChange={handleFilterChange}
                className="flex-1 border border-gray-300 rounded-md p-2"
                placeholder="End Time"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ startDate: '', endDate: '', startTime: '', endTime: '' })}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {filteredReservations.length === 0 ? (
            <p className="text-gray-600 italic">
              {reservations.length === 0 ? 'No reservations found.' : 'No reservations match the selected filters.'}
            </p>
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
                {filteredReservations.map((reservation) => (
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
