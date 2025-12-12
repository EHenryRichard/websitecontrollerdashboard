'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import NotificationPanel from '@/components/shared/NotificationPanel';
import SearchModal from '@/components/shared/SearchModal';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
import { useGlobalUI } from '@/contexts/GlobalUIProvider'; 
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthProvider';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setNotificationOpen, setSearchOpen } =
    useGlobalUI();
const { isAuthenticated, isLoading } = useAuth();
const router = useRouter();
// Protect this page - redirect to login if not authenticated
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.replace('/auth/login');
  }
}, [isAuthenticated, isLoading, router]);



  // Fix for mobile browser address bar issue
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(
        '--vh',
        `${vh}px`
      );
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener(
        'orientationchange',
        setVH
      );
    };
  }, []);
// Don't render content if not authenticated
if (!isAuthenticated) {
  return null;
}
  return (
    <div
      className="flex h-[100dvh] bg-[#0a0a0a] text-white overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden h-16 bg-[#0f0f0f] border-b border-[#222222] flex items-center justify-between px-4">
          {/* Left Side - Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiMenu size={24} />
            </button>
            <div className=" w-6 h-7 ">
              <Image
                src="/favicon.png"
                width={40}
                height={16}
                alt="Picture of the author"
              />
            </div>
          </div>

          {/* Right Side - Search & Notifications */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiSearch size={20} />
            </button>
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative text-gray-400 hover:text-white transition-colors"
            >
              <FiBell size={20} />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>

      {/* Global Components */}
      <NotificationPanel />
      <SearchModal />
    </div>
  );
}
