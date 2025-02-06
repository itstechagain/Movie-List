import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../utils/Auth.js';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(Auth.loggedIn());

  useEffect(() => {
    const authStatus  = () => setIsLoggedIn(Auth.loggedIn());

    window.addEventListener('authChange', authStatus );

    return () => {
      window.removeEventListener('authChange', authStatus );
    };
  }, []);

  const handleLogout = () => {
    Auth.logout(navigate);
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div >
          <span>Rate My Flick 🎥</span>
        </div>

        <div >
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                >
                Log Out
              </button>
            </>
          ) : (
            <div>
            <Link to="/login">Log In</Link>
            <Link to="/signup" style={{ marginLeft: '10px' }}>Sign Up</Link>
            </div>
          )
          }
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;