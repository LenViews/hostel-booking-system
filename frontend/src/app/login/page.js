'use client';

import { useState } from 'react';

import { useRouter }
from 'next/navigation';

import toast from 'react-hot-toast';

import api from '../../lib/api';

import { useAuth }
from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response =
        await api.post(
          '/auth/login',
          formData
        );

      const token =
        response.data.data.token;

      login(token);

      toast.success(
        'Login successful'
      );

      router.push('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message
        || 'Login failed'
      );
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    "
    >
      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        p-8
        rounded-xl
        shadow-lg
        w-full
        max-w-md
      "
      >
        <h1
          className="
          text-3xl
          font-bold
          mb-6
        "
        >
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="
          w-full
          p-3
          border
          rounded-lg
          mb-4
        "
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="
          w-full
          p-3
          border
          rounded-lg
          mb-4
        "
        />

        <button
          type="submit"
          className="
          w-full
          bg-black
          text-white
          py-3
          rounded-lg
        "
        >
          Login
        </button>
      </form>
    </div>
  );
}
