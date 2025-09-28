import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setAuthToken(token);
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/biometric?type=weight');
      // Map to Recharts-friendly format and reverse to chronological order
      const arr = res.data.map(item => ({
        date: new Date(item.recordedAt).toLocaleDateString(),
        value: item.value
      })).reverse();
      setData(arr);
      const recRes = await API.get('/user/recommendations');
      setRecommendations(recRes.data.recommendations);
    } catch (err) {
      console.error(err);
    }
  };

  const addEntry = async e => {
    e.preventDefault();
    if (!value) return;
    try {
      await API.post('/biometric', { type: 'weight', value: parseFloat(value) });
      setValue('');
      fetchData();
    } catch (err) {
      alert('Failed to add entry');
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Weight (kg)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis domain={['auto','auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <form onSubmit={addEntry} className="mt-3 flex">
            <input value={value} onChange={e => setValue(e.target.value)} placeholder="Weight (kg)" type="number" step="0.1"
              className="border p-2 rounded mr-2 flex-1" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">AI Recommendations</h3>
          <div className="text-sm whitespace-pre-wrap">
            {recommendations ? (recommendations.message || JSON.stringify(recommendations, null, 2)) : 'Loading recommendations...'}
          </div>
        </div>
      </div>
    </div>
  );
}
