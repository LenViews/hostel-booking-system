'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roomAPI, bookingAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RoomDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await roomAPI.getById(id);
        setRoom(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book');
      router.push('/login');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can book rooms');
      return;
    }
    try {
      await bookingAPI.create({ room_id: id, start_date: startDate, end_date: endDate });
      toast.success('Booking successful!');
      router.push('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!room) return <div className="text-center py-12">Room not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <img src={room.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'} alt={room.room_number} className="w-full h-96 object-cover" />
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">Room {room.room_number}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{room.hostel_name}</p>
          <p className="text-gray-500 mb-4">{room.location}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500">Room Type</p>
              <p className="text-lg font-semibold">{room.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="text-lg font-semibold">{room.capacity} persons</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold text-primary-600">${room.price}/month</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className={`text-lg font-semibold ${room.is_available ? 'text-green-600' : 'text-red-600'}`}>
                {room.is_available ? 'Available' : 'Not Available'}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Book This Room</h3>
            {room.is_available ? (
              <form onSubmit={handleBooking} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Confirm Booking</button>
              </form>
            ) : (
              <p className="text-red-600">This room is currently unavailable for booking.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
