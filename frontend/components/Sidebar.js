'use client';
import { FiHome, FiBookOpen, FiUser, FiGrid, FiCalendar } from 'react-icons/fi';

export default function Sidebar({ role, activeTab, setActiveTab }) {
  const studentTabs = [
    { id: 'bookings', label: 'My Bookings', icon: FiBookOpen },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'hostels', label: 'Hostels', icon: FiGrid },
    { id: 'bookings', label: 'All Bookings', icon: FiCalendar },
  ];

  const tabs = role === 'admin' ? adminTabs : studentTabs;

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
