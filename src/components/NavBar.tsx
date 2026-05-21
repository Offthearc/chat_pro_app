import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NavBar.css'

export function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <Link to="/rooms" className="navbar__brand">
        ChatPro
      </Link>
      {user && (
        <div className="navbar__right">
          <Link to="/rooms" className="navbar__nav-link">
            Rooms
          </Link>
          <Link to="/dm" className="navbar__nav-link">
            Messages
          </Link>
          <span className="navbar__username">{user.username}</span>
          <button className="navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
