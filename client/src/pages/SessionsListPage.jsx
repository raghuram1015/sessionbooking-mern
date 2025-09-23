import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SessionsListPage() {
  const [sessions, setSessions] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/sessions${category ? `?category=${category}` : ''}`);
        setSessions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) {
    return <div className="text-center">Loading sessions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Sessions</h2>
      <div className="mb-4">
        <label htmlFor="category" className="mr-2">Filter by Category:</label>
        <select
          id="category"
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          <option value="Tech">Tech</option>
          <option value="Career">Career</option>
          <option value="Design">Design</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map(session => (
          <div key={session._id} className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-bold mb-2">{session.title}</h3>
            <p className="text-gray-700">{session.description}</p>
            <p className="text-gray-700">Category: {session.category}</p>
            <p className="text-gray-700">Date: {new Date(session.dateTime).toLocaleString()}</p>
            <p className="text-gray-700">Duration: {session.duration} minutes</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionsListPage;
