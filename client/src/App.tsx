import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav.js';
import MovieList from './pages/MoviesPage.js';
import ErrorPage from './pages/ErrorPage.js';
import LoginPage from './pages/LoginPage.js';
import SignUpPage from './pages/SignUpPage.js';

const App: React.FC = () => {
  console.log('VITE_NODE_ENV:', import.meta.env.VITE_NODE_ENV);

  return (
    <div>
      <Router>
        <Nav />
        <div>
          <Routes>
            <Route path="/" element={<MovieList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
