'use client';

import {
  useEffect,
  useState,
} from 'react';

import DashboardLayout
from '../../../components/layouts/DashboardLayout';

import api from '../../../lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] =
    useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response =
        await api.get(
          '/bookings/my-bookings'
        );

      setBookings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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
          My Bookings
        </h1>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="
              bg-white
              p-6
              rounded-2xl
              shadow-sm
            "
            >
              <div
                className="
                flex
                justify-between
                items-center
              "
              >
                <div>
                  <h2
                    className="
                    text-2xl
                    font-bold
                  "
                  >
                    Room
                    {' '}
                    {booking.room_number}
                  </h2>

                  <p className="text-gray-500">
                    {
                      booking.hostel_name
                    }
                  </p>
                </div>

                <span
                  className="
                  bg-black
                  text-white
                  px-4
                  py-2
                  rounded-full
                  text-sm
                "
                >
                  {booking.status}
                </span>
              </div>

              <div
                className="
                mt-6
                grid
                grid-cols-2
                gap-4
              "
              >
                <div>
                  <p
                    className="
                    text-gray-500
                    text-sm
                  "
                  >
                    Check In
                  </p>

                  <p className="font-bold">
                    {
                      booking.check_in_date
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="
                    text-gray-500
                    text-sm
                  "
                  >
                    Check Out
                  </p>

                  <p className="font-bold">
                    {
                      booking.check_out_date
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
