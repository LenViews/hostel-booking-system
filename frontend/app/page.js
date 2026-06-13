'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hostelAPI } from '@/lib/api';

export default function LandingPage() {
  const [featuredHostels, setFeaturedHostels] = useState([]);

  useEffect(() => {
    hostelAPI.getAll().then(res => setFeaturedHostels(res.data.slice(0, 3)));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Student Accommodation</h1>
          <p className="text-xl mb-8">Safe, Affordable, and Convenient Hostels Near Your Campus</p>
          <Link href="/hostels" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Browse Hostels
          </Link>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Hostels</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredHostels.map(hostel => (
            <div key={hostel.id} className="card">
              <img src={hostel.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'} alt={hostel.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{hostel.location}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{hostel.description?.substring(0, 100)}...</p>
                <Link href={`/hostels/${hostel.id}`} className="text-primary-600 font-semibold hover:underline">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}