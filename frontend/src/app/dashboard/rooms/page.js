'use client';

import {
  useEffect,
  useState,
} from 'react';

import DashboardLayout
from '../../../components/layouts/DashboardLayout';

import api from '../../../lib/api';

export default function RoomsPage() {
  const [rooms, setRooms] =
    useState([]);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [search, setSearch] =
    useState('');

  const [bookingData, setBookingData] =
    useState({
        check_in_date: '',
        check_out_date: '',
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
        setLoading(true);

        const response = await api.get('/rooms');

        setRooms(response.data);
    } catch (error) {
        console.error(error);
        } finally {
            setLoading(false);
        }
  };

  const createBooking =
    async () => {
        try {
            await api.post(
                '/bookings',
                {
                    room_id:
                    selectedRoom.id,
                    ...bookingData,
                }
            );

            toast.success(
                'Booking successful'
            );

            setSelectedRoom(null);

            fetchRooms();
        } catch (error) {
            toast.error(
                error.response?.data?.message
            );
        }
  };

  if (loading) {
    return (
        <DashboardLayout>
        <div className="text-center py-10 text-gray-500">
              Loading rooms...
        </div>
        </DashboardLayout>
        );
  }

  return (
    <DashboardLayout>
      <div>
        <h1
          className="
          text-4xl
          font-bold
          mb-8
        "
        >
          Available Rooms
        </h1>

      <input
        type="text"
        placeholder="Search hostel..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
            }
        className="
          w-full
          md:w-96
          p-3
          border
          rounded-xl
          mb-8"
      />

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
        >
          {rooms
              .filter((room) =>
                    room.hostel_name
                      .toLowerCase()
                      .includes(
                          search.toLowerCase()
                          )
                  )
              .map((room) => (
            <div
              key={room.id}
              className="
              bg-white
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
            >
              <img
                src={`http://localhost:5000${room.image_url}`}
                alt="Room"
                className="
                  h-48
                  w-full
                  object-cover"
              />

              <div className="p-6">
                <h2
                  className="
                  text-2xl
                  font-bold
                "
                >
                  Room {room.room_number}
                </h2>

                <p
                  className="
                  text-gray-500
                  mt-2
                "
                >
                  {room.hostel_name}
                </p>

                <div
                  className="
                  flex
                  justify-between
                  mt-6
                "
                >
                  <div>
                    <p
                      className="
                      text-gray-500
                      text-sm
                    "
                    >
                      Capacity
                    </p>

                    <p className="font-bold">
                      {room.capacity}
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                      text-gray-500
                      text-sm
                    "
                    >
                      Price
                    </p>

                    <p className="font-bold">
                      KES {room.price}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedRoom(room)
                  }
                  className="
                  w-full
                  mt-6
                  bg-black
                  text-white
                  py-3
                  rounded-xl
                "
                >
                  Book Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <div
          className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
        "
        >
          <div
            className="
            bg-white
            p-8
            rounded-2xl
            w-full
            max-w-md
          "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-6
            "
            >
              Book Room
            </h2>

            <input
              type="date"
              value={bookingData.check_in_date}
              onChange={(e) =>
                  setBookingData({
                      ...bookingData,
                      check_in_date: e.target.value,
                      })
                  }
            className="
                w-full
                border
                p-3
                rounded-lg
                mb-4"
            />

            <input
              type="date"
              value={bookingData.check_out_date}
              onChange={(e) =>
                  setBookingData({
                      ...bookingData,
                      check_out_date: e.target.value,
                      })
                  }
              className="
                w-full
                border
                p-3
                rounded-lg
                mb-6"
            />

            <div
              className="
              flex
              gap-4
            "
            >
              <button
                onClick={() =>
                  setSelectedRoom(null)
                }
                className="
                flex-1
                border
                py-3
                rounded-xl
              "
              >
                Cancel
              </button>

              <button
                onClick={createBooking}
                className="
                flex-1
                bg-black
                text-white
                py-3
                rounded-xl
              "
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
