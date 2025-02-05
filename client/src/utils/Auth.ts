import { JwtPayload, jwtDecode } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
  id: string; 
}

class Auth {
  getProfile(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken;
    } catch (error) {
      console.error('Error Decoding Token!', error);
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.exp ? Date.now() >= decoded.exp * 1000 : false;
      } catch (error) {
        console.error('Error decoding token:', error);
        return true;
      }
    }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string, navigate: (path: string) => void) {
    localStorage.setItem('id_token', idToken);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  }

  logout(navigate: (path: string) => void) {
    localStorage.removeItem('id_token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  }
}

export default new Auth();