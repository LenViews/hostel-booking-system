'use client';
import { useState, useEffect } from 'react';
import { useAuth } from @/context/AuthContext';
import { hostelAPI, roomAPI, bookingAPI } from @/lib/api';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'hostels' || activeTab === 'overview') {
      const res = await hostelAPI.getAll();
      setHostels(res.data);
    }
    if (activeTab === 'bookings') {
      const res = await bookingAPI.getAll();
      setBookings(res.data);
    }
  };

  const handleDeleteHostel = async (id) => {
    if (confirm('Delete this hostel? All rooms and bookings will be lost.')) {
      await hostelAPI.delete(id);
      toast.success('Hostel deleted');
      loadData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'hostel') {
        if (formData.id) {
          await hostelAPI.update(formData.id, formData);
        } else {
          await hostelAPI.create(formData);
        }
      } else if (modalType === 'room') {
        if (formData.id) {
          await roomAPI.update(formData.id, formData);
        } else {
          await roomAPI.create(selectedHostel.id, formData);
        }
      }
      toast.success(`Successfully ${formData.id ? 'updated' : 'created'}`);
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold">Total Hostels</h3>
                <p className="text-3xl font-bold text-primary-600">{hostels.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold">Total Bookings</h3>
                <p className="text-3xl font-bold text-primary-600">{bookings.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hostels' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Hostels</h2>
              <button onClick={() => { setModalType('hostel'); setFormData({}); setShowModal(true); }} className="btn-primary">
                Add Hostel
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {hostels.map(hostel => (
                <div key={hostel.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                  <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{hostel.location}</p>
                  <p className="text-sm text-gray-500 mb-4">{hostel.description?.substring(0, 100)}</p>
                  <div className="flex space-x-2">
                    <button onClick={() => { setSelectedHostel(hostel); setModalType('room'); setFormData({}); setShowModal(true); }} className="px-3 py-1 bg-green-600 text-white rounded">
                      Add Room
                    </button>
                    <button onClick={() => { setModalType('hostel'); setFormData(hostel); setShowModal(true); }} className="px-3 py-1 bg-blue-600 text-white rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteHostel(hostel.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-xl">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Student</th>
                    <th className="px-6 py-3 text-left">Hostel</th>
                    <th className="px-6 py-3 text-left">Room</th>
                    <th className="px-6 py-3 text-left">Dates</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id} className="border-t dark:border-gray-700">
                      <td className="px-6 py-4">{booking.student_name}</td>
                      <td className="px-6 py-4">{booking.hostel_name}</td>
                      <td className="px-6 py-4">{booking.room_number}</td>
                      <td className="px-6 py-4">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          booking.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Add'} {modalType}</h3>
            <form onSubmit={handleSubmit}>
              {modalType === 'hostel' && (
                <>
                  <input type="text" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" required />
                  <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" required />
                  <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" />
                  <input type="text" placeholder="Image URL" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" />
                </>
              )}
              {modalType === 'room' && (
                <>
                  <input type="text" placeholder="Room Number" value={formData.room_number || ''} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" required />
                  <input type="text" placeholder="Type (e.g., Single, Double)" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" required />
                  <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" required />
                  <input type="number" placeholder="Capacity" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" required />
                  <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mb-3 px-4 py-2 border rounded" />
                </>
              )}
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
