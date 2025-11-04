import React from 'react';

const ViewReservations = () => {
  return (
    <div className="min-h-screen bg-[#242424] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Current Reservations</h2>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 flex items-center gap-2"
          >
            <span className="text-xl">←</span> Back
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Placeholder for reservation list - will be implemented later */}
          <p className="text-gray-600 italic">No reservations found.</p>
        </div>
      </div>
    </div>
  );
};

export default ViewReservations;
