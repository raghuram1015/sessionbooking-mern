import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Video } from 'lucide-react';
import { supabase, Session } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function BrowseSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const { user } = useAuth();

  const categories = ['All Categories', 'Workshop', 'Seminar', 'Tutorial', 'Webinar', 'Conference'];

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, selectedCategory]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          host:profiles(*)
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      const sessionsData = data || [];
      setSessions(sessionsData);

      const counts: Record<string, number> = {};
      for (const session of sessionsData) {
        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', session.id)
          .eq('status', 'confirmed');

        counts[session.id] = count || 0;
      }
      setBookingCounts(counts);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (searchQuery) {
      filtered = filtered.filter((session) =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((session) =>
        session.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredSessions(filtered);
  };

  const handleBooking = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            session_id: sessionId,
            user_id: user.id,
            status: 'confirmed',
          },
        ]);

      if (error) throw error;

      alert('Session booked successfully!');
      fetchSessions();
    } catch (error: any) {
      if (error.code === '23505') {
        alert('You have already booked this session!');
      } else {
        console.error('Error booking session:', error);
        alert('Failed to book session. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Browse Sessions</h1>
            <p className="text-gray-600 mt-1">Discover and book sessions that interest you</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const spotsLeft = session.max_attendees - (bookingCounts[session.id] || 0);

          return (
            <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {session.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {spotsLeft} spots left
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(session.time)} • {session.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">{session.host?.name || 'Unknown Host'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  <button
                    onClick={() => handleBooking(session.id)}
                    disabled={spotsLeft === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No sessions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
