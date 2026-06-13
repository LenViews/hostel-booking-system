'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingAPI, userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState({ active: [], history: [] });
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        bookingAPI.getMyBookings(),
        userAPI.getMe()
      ]);
      setBookings(bookingsRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancel(bookingId);
        toast.success('Booking cancelled successfully');
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile(profile);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar role="student" activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Active Bookings</h2>
            {bookings.active.length === 0 ? (
              <p className="text-gray-500">No active bookings</p>
            ) : (
              <div className="space-y-4">
                {bookings.active.map(booking => (
                  <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{booking.hostel_name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Room {booking.room_number} - {booking.type}</p>
                        <p className="text-sm text-gray-500">Check-in: {new Date(booking.start_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Check-out: {new Date(booking.end_date).toLocaleDateString()}</p>
                        <p className="text-primary-600 font-semibold mt-2">${booking.price}/month</p>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-6">Booking History</h2>
            {bookings.history.length === 0 ? (
              <p className="text-gray-500">No booking history</p>
            ) : (
              <div className="space-y-4">
                {bookings.history.map(booking => (
                  <div key={booking.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                    <div>
                      <h3 className="text-lg font-semibold">{booking.hostel_name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">Room {booking.room_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password (optional)</label>
                <input
                  type="password"
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
              </div>
              <button type="submit" className="btn-primary">Update Profile</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
