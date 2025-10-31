import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GlobalUIProvider } from '@/contexts/GlobalUIProvider';

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
  description:
    'Manage your client websites, backups, and messages',
  icons: '/favicon.png',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalUIProvider>{children}</GlobalUIProvider>
      </body>
    </html>
  );
}
