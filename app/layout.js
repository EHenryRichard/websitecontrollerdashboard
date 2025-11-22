import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';
import { DataProvider } from '@/contexts/DataProvider';
import { GlobalUIProvider } from '@/contexts/GlobalUIProvider';
import { UserProvider } from '@/contexts/userProvider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Site Manager Dashboard',
  description: 'Manage your client websites, backups, and messages',
  icons: '/favicon.png',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <UserProvider>
            <DataProvider>
              <GlobalUIProvider>
                {children}
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                  }}
                />
              </GlobalUIProvider>
            </DataProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
