import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MySessionsPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMySessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/bookings/me');
        const bookings = response.data;

        const now = new Date();
        const upcoming = bookings.filter(booking => new Date(booking.session.dateTime) > now);
        const past = bookings.filter(booking => new Date(booking.session.dateTime) <= now);

        setUpcomingSessions(upcoming);
        setPastSessions(past);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchMySessions();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      // Refresh sessions after cancellation
      const response = await axios.get('/api/bookings/me');
      const bookings = response.data;

      const now = new Date();
      const upcoming = bookings.filter(booking => new Date(booking.session.dateTime) > now);
      setUpcomingSessions(upcoming);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="text-center">Loading sessions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Sessions</h2>

      <div>
        <h3 className="text-xl font-bold mb-2">Upcoming Sessions</h3>
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSessions.map(booking => (
              <div key={booking._id} className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-bold mb-2">{booking.session.title}</h3>
                <p className="text-gray-700">Date: {new Date(booking.session.dateTime).toLocaleString()}</p>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming sessions.</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Past Sessions</h3>
        {pastSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastSessions.map(booking => (
              <div key={booking._id} className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-bold mb-2">{booking.session.title}</h3>
                <p className="text-gray-700">Date: {new Date(booking.session.dateTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No past sessions.</p>
        )}
      </div>
    </div>
  );
}

export default MySessionsPage;
