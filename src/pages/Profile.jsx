import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState({
    age:'', gender:'', heightCm:'', targetWeightKg:'', activityLevel:'moderate'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/user/me');
        const p = res.data.profile || {};
        setProfile({
          age: p.age || '',
          gender: p.gender || '',
          heightCm: p.heightCm || '',
          targetWeightKg: p.targetWeightKg || '',
          activityLevel: p.activityLevel || 'moderate'
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const onChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/user/me', { profile });
      alert('Profile saved');
    } catch (err) {
      alert('Failed to save profile');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl mb-4">Profile</h2>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-6 rounded shadow">
        <input name="age" type="number" value={profile.age} onChange={onChange} placeholder="Age" className="w-full border p-2 rounded" />
        <input name="gender" value={profile.gender} onChange={onChange} placeholder="Gender" className="w-full border p-2 rounded" />
        <input name="heightCm" type="number" value={profile.heightCm} onChange={onChange} placeholder="Height (cm)" className="w-full border p-2 rounded" />
        <input name="targetWeightKg" type="number" value={profile.targetWeightKg} onChange={onChange} placeholder="Target weight (kg)" className="w-full border p-2 rounded" />
        <select name="activityLevel" value={profile.activityLevel} onChange={onChange} className="w-full border p-2 rounded">
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <button className="w-full bg-green-600 text-white p-2 rounded">{loading ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
}
