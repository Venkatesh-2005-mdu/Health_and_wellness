import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="email" type="email" onChange={onChange} value={form.email}
               placeholder="Email" required className="w-full border p-2 rounded" />
        <input name="password" type="password" onChange={onChange} value={form.password}
               placeholder="Password" required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
