import { X, Calendar, Clock, Users, Video, User } from 'lucide-react';
import { Session } from '../../lib/supabase';

type SessionDetailsModalProps = {
  session: Session;
  onClose: () => void;
  onBook?: () => void;
  onEdit?: () => void;
  isHost?: boolean;
};

export default function SessionDetailsModal({
  session,
  onClose,
  onBook,
  onEdit,
  isHost
}: SessionDetailsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {session.cover_image_url && (
              <img
                src={session.cover_image_url}
                alt={session.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            )}

            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                {session.category}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{session.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{session.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(session.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(session.time)} ({session.duration} min)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Max Attendees</p>
                  <p className="font-semibold text-gray-900">{session.max_attendees} spots</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Host</p>
                  <p className="font-semibold text-gray-900">{session.host?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {session.meeting_link && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-blue-900">Meeting Link</p>
                </div>
                <a
                  href={session.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline break-all"
                >
                  {session.meeting_link}
                </a>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            {isHost && onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Edit Session
              </button>
            )}
            {!isHost && onBook && (
              <button
                onClick={onBook}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
