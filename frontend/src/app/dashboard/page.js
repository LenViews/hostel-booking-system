'use client';

import {
  useEffect,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  useAuth,
} from '../../context/AuthContext';

export default function Dashboard() {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [
    user,
    loading,
    router,
  ]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10">
      <h1
        className="
        text-4xl
        font-bold
      "
      >
        Dashboard
      </h1>

      <p className="mt-4">
        Welcome User ID:
        {' '}
        {user?.id}
      </p>

      <p>
        Role:
        {' '}
        {user?.role}
      </p>
    </div>
  );
}
