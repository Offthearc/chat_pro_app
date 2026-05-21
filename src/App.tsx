import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './components/AuthGuard'
import { NavBar } from './components/NavBar'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function PlaceholderRooms() {
  return <main style={{ padding: 'var(--space-lg)' }}>Rooms coming soon</main>
}

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/rooms"
          element={
            <AuthGuard>
              <PlaceholderRooms />
            </AuthGuard>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <AuthGuard>
              <PlaceholderRooms />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </>
  )
}

export default App
