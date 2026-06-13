'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';  // ← hook to get [id]
import Link from 'next/link';
import { hostelAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function HostelDetails() {
  const { id } = useParams();   // gets the value from the URL, e.g. /hostels/123 → id = "123"
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadHostel() {
      try {
        const res = await hostelAPI.getById(id);
        setHostel(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadHostel();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!hostel) return <div className="text-center py-12">Hostel not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/hostels" className="text-primary-600 hover:underline">← Back to Hostels</Link>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <img src={hostel.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'} alt={hostel.name} className="w-full h-96 object-cover rounded-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{hostel.location}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{hostel.description}</p>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
            <div className="space-y-4">
              {hostel.rooms?.filter(room => room.is_available).map(room => (
                <Link href={`/rooms/${room.id}`} key={room.id}>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:shadow-md">
                    <div>
                      <p className="font-semibold">Room {room.room_number}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{room.type} | Capacity: {room.capacity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">${room.price}/month</p>
                      {user?.role === 'student' && (
                        <span className="text-sm text-green-600">Available</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
