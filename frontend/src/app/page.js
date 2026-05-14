import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      className="
      min-h-screen
      flex
      flex-col
      items-center
      justify-center
      bg-black
      text-white
    "
    >
      <h1
        className="
        text-6xl
        font-bold
        mb-6
      "
      >
        Hostel Booking System
      </h1>

      <p
        className="
        text-lg
        mb-8
      "
      >
        Smart student accommodation platform
      </p>

      <Link
        href="/login"
        className="
        bg-white
        text-black
        px-6
        py-3
        rounded-xl
      "
      >
        Login
      </Link>
    </main>
  );
}
