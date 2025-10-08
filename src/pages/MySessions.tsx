import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, Eye, Edit } from 'lucide-react';
import { supabase, Session } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SessionDetailsModal from '../components/Modals/SessionDetailsModal';
import EditSessionModal from '../components/Modals/EditSessionModal';

export default function MySessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [viewingSession, setViewingSession] = useState<Session | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('host_id', user.id)
        .order('date', { ascending: false });

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

  const fetchAttendees = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('session_id', sessionId)
        .eq('status', 'confirmed');

      if (error) throw error;

      setAttendees(data || []);
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Error fetching attendees:', error);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Video className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600 mt-1">Sessions you're hosting</p>
          </div>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => {
            const attendeeCount = bookingCounts[session.id] || 0;
            const showingAttendees = selectedSession === session.id;

            return (
              <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{session.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {session.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{session.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>{formatTime(session.time)} • {session.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5" />
                      <span>{attendeeCount} / {session.max_attendees} attendees</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setViewingSession(session)}
                      className="inline-flex items-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setEditingSession(session)}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Session
                    </button>
                    <button
                      onClick={() => {
                        if (showingAttendees) {
                          setSelectedSession(null);
                          setAttendees([]);
                        } else {
                          fetchAttendees(session.id);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {showingAttendees ? 'Hide Attendees' : 'View Attendees'}
                    </button>
                  </div>
                </div>

                {showingAttendees && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Registered Attendees</h4>
                    {attendees.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {attendees.map((booking) => (
                          <div key={booking.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {booking.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{booking.user?.name}</p>
                                <p className="text-sm text-gray-600 truncate">{booking.user?.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No attendees yet</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-600">Host your first session to get started!</p>
            </div>
          )}
        </div>

        {viewingSession && (
          <SessionDetailsModal
            session={viewingSession}
            onClose={() => setViewingSession(null)}
            onEdit={() => {
              setEditingSession(viewingSession);
              setViewingSession(null);
            }}
            isHost={true}
          />
        )}

        {editingSession && (
          <EditSessionModal
            session={editingSession}
            onClose={() => setEditingSession(null)}
            onSuccess={() => {
              fetchSessions();
              setEditingSession(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
