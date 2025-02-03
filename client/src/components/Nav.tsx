import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../utils/Auth';

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
    <nav >
      <div >
        <div >
          <span>RMF</span>
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
            <Link
              to="/login"
              >
              Continue
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;