'use client';

import DashboardLayout
from '../../components/layouts/DashboardLayout';

import { useAuth }
from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div>
        <h1
          className="
          text-4xl
          font-bold
          mb-4
        "
        >
          Welcome Back
        </h1>

        <p className="text-gray-600">
          Logged in as:
          {' '}
          {user?.role}
        </p>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mt-10
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
            <h2
              className="
              text-gray-500
            "
            >
              Total Rooms
            </h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              24
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
            <h2 className="text-gray-500">
              Active Bookings
            </h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              12
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
            <h2 className="text-gray-500">
              Available Rooms
            </h2>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              8
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
