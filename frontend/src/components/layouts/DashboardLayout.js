'use client';

import Link from 'next/link';

import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  BarChart3,
  LogOut,
} from 'lucide-react';

import { useAuth }
from '../../context/AuthContext';

import { useRouter }
from 'next/navigation';

export default function DashboardLayout({
  children,
}) {
  const { logout, user } =
    useAuth();

  const router = useRouter();

  const handleLogout = () => {
    logout();

    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <aside
        className="
        w-72
        bg-black
        text-white
        p-6
        flex
        flex-col
      "
      >
        <h1
          className="
          text-2xl
          font-bold
          mb-10
        "
        >
          HostelSys
        </h1>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="
            flex
            items-center
            gap-3
            hover:bg-white/10
            p-3
            rounded-xl
          "
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/rooms"
            className="
            flex
            items-center
            gap-3
            hover:bg-white/10
            p-3
            rounded-xl
          "
          >
            <BedDouble size={20} />
            Rooms
          </Link>

          <Link
            href="/dashboard/bookings"
            className="
            flex
            items-center
            gap-3
            hover:bg-white/10
            p-3
            rounded-xl
          "
          >
            <CalendarDays size={20} />
            Bookings
          </Link>

          {user?.role === 'admin' && (
            <Link
              href="/dashboard/admin"
              className="
              flex
              items-center
              gap-3
              hover:bg-white/10
              p-3
              rounded-xl
            "
            >
              <BarChart3 size={20} />
              Admin
            </Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="
          mt-auto
          flex
          items-center
          gap-3
          bg-red-500
          p-3
          rounded-xl
        "
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}

      <main
        className="
        flex-1
        bg-gray-100
        p-10
      "
      >
        {children}
      </main>
    </div>
  );
}
