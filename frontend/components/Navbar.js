'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const navLinks = [
    { href: '/hostels', label: 'Hostels', show: true },
    { href: user?.role === 'student' ? '/student/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : null, label: 'Dashboard', show: !!user },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              HostelHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => link.href && (
              <Link key={link.href} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
                <button onClick={logout} className="btn-primary text-sm px-4 py-2">Logout</button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login" className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                  Login
                </Link>
                <Link href="/register" className="btn-primary px-4 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => link.href && (
              <Link key={link.href} href={link.href} className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="py-2 text-gray-600 dark:text-gray-400">Hello, {user.name}</div>
                <button onClick={logout} className="w-full btn-primary">Logout</button>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/login" className="block w-full text-center px-4 py-2 border border-primary-600 rounded-lg">
                  Login
                </Link>
                <Link href="/register" className="block w-full text-center btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}