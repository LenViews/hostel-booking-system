import './globals.css';

import {
  Toaster,
} from 'react-hot-toast';

import {
  AuthProvider,
} from '../context/AuthContext';

export const metadata = {
  title: 'Hostel Booking System',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
