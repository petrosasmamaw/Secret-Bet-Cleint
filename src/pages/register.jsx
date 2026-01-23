import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../Slices/authSlice';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="page">
      <h1 className="page-header">Register <span>Now</span></h1>
      <p className="page-description">Create a new account. </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
          <p className="page-description">Go to your email and confirm our email, then return to the login page and login by correct email and password.</p>
      </form>
      <p className="auth-link">Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;
