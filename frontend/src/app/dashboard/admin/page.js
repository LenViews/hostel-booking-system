'use client';

import {
  useEffect,
  useState,
} from 'react';

import DashboardLayout
from '../../../components/layouts/DashboardLayout';

import api from '../../../lib/api';

export default function AdminPage() {
  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response =
        await api.get(
          '/bookings/analytics/summary'
        );

      setAnalytics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) {
    return <p>Loading...</p>;
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
          Admin Analytics
        </h1>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
        >
          <div
            className="
            bg-white
            p-6
            rounded-2xl
            shadow-sm
          "
          >
            <h2>Total Bookings</h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {
                analytics.total_bookings
              }
            </p>
          </div>

          <div
            className="
            bg-white
            p-6
            rounded-2xl
            shadow-sm
          "
          >
            <h2>Confirmed</h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {
                analytics.confirmed_bookings
              }
            </p>
          </div>

          <div
            className="
            bg-white
            p-6
            rounded-2xl
            shadow-sm
          "
          >
            <h2>Cancelled</h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {
                analytics.cancelled_bookings
              }
            </p>
          </div>

          <div
            className="
            bg-white
            p-6
            rounded-2xl
            shadow-sm
          "
          >
            <h2>Available Rooms</h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {
                analytics.available_rooms
              }
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
