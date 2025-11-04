import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ReservationForm from './Pages/ReservationForm'
import ViewReservations from './Pages/ViewReservations'

function App() {
  // Minimal tables data to pass to the form
  const [tables] = useState([
    { id: 't1', location: 'Window', capacity: 2 },
    { id: 't2', location: 'Center', capacity: 4 },
    { id: 't3', location: 'Patio', capacity: 6 },
  ])

  // Simple onSubmit handler that logs the data (replace with real API call later)
  const handleSubmit = (data, editingId) => {
    if (editingId) {
      console.log('Update reservation', editingId, data)
    } else {
      console.log('Create reservation', data)
    }
  }

  const HomePage = () => (
    <div className="min-h-screen flex relative">
      <Link 
        to="/reservations"
        className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-900 rounded-lg shadow-md hover:bg-gray-100 flex items-center gap-2"
      >
        View Reservations <span className="text-xl">→</span>
      </Link>
      <ReservationForm
        editingReservation={null}
        onSubmit={handleSubmit}
        tables={tables}
      />
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservations" element={<ViewReservations />} />
      </Routes>
    </Router>
  )
}

export default App
