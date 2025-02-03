import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP } from '../graphql/Mutations';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/Auth';

const SignUpUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [register, { loading, error }] = useMutation(SIGNUP);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: formData });

      if (data?.register?.token) {
        Auth.login(data.register.token, navigate);
      } else {
        console.error('Unexpected Data Structure:', data);
      }
    } catch (err) {
      console.error('Error During SignUp', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        className="signupcreds"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="signupcreds"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="signupcreds"
      />

      {error && (
        <p >{error.message || 'SignUp Error'}</p>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Loading' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpUser;