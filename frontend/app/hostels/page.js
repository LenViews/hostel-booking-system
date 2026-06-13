'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hostelAPI } from '@/lib/api';
import { FiSearch } from 'react-icons/fi';

export default function HostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostels();
  }, [search]);

  const loadHostels = async () => {
    setLoading(true);
    try {
      const res = await hostelAPI.getAll(search);
      setHostels(res.data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Hostel</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map(hostel => (
            <Link href={`/hostels/${hostel.id}`} key={hostel.id}>
              <div className="card cursor-pointer">
                <img src={hostel.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'} alt={hostel.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{hostel.location}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{hostel.total_rooms || 0} rooms</span>
                    <span>{hostel.available_rooms || 0} available</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}