import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/Mutations.js';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/Auth.js';

const LoginUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [login, { loading, error }] = useMutation(LOGIN);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: formData });

      if (data?.login?.token) {
        Auth.login(data.login.token, navigate);
      } else {
        console.error('Unexpected Data Structure', data);
      }
    } catch (err) {
      console.error('Error During LogIn', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="logincreds"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="logincreds"
      />

      {error && (
        <p >{error.message || 'Login Error'}</p>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Loading' : 'Login'}
      </button>
    </form>
  );
};

export default LoginUser;