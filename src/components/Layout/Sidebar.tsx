import { useState } from 'react';
import { Calendar, Plus, BookOpen, Video, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const baseNavItems = [
    { id: 'browse', label: 'Browse Sessions', icon: Calendar },
    { id: 'host', label: 'Host Session', icon: Plus },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen },
    { id: 'sessions', label: 'My Sessions', icon: Video },
  ];

  const navItems = profile?.is_admin
    ? [...baseNavItems, { id: 'admin', label: 'Admin Management', icon: Shield }]
    : baseNavItems;

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SessionHub</h1>
            <p className="text-sm text-gray-600">Book & Host Sessions</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-gray-900 truncate">{profile?.name}</p>
            <p className="text-sm text-gray-600 truncate">{profile?.email}</p>
          </div>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-gray-900">{profile?.name}</p>
                <p className="text-sm text-gray-600">{profile?.email}</p>
                {profile?.is_admin && (
                  <p className="text-sm text-blue-600 mt-1">Admin</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  signOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
