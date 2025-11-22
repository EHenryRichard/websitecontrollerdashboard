'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiUser, FiChevronDown, FiX, FiLogOut } from 'react-icons/fi';
import { navigationData, settingsData } from '../../data/data';
import { useUser } from '@/contexts/userProvider';
import { useAuth } from '@/contexts/AuthProvider';

export default function Sidebar({ isOpen, onClose }) {
  const { userDetails } = useUser();
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Glass Backdrop - shows on mobile when sidebar opens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-full lg:w-64 
          bg-[#111111]
          border-r border-[#222222]/85 
          flex flex-col
          shadow-2xl lg:shadow-none
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        {/* Logo - Fixed at top */}
        <div className="relative z-20 h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-[#222222] bg-[#111111]">
          <div className=" w-6 h-7 ">
            <Image src="/favicon.png" width={40} height={16} alt="Picture of the author" />
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="relative z-10 flex-1 py-4 overflow-y-auto overflow-x-hidden bg-[#111111]">
          {/* Main Section */}

          <div className="px-3 mb-6">
            <div className="flex items-center mb-3 gap-3 px-2 py-2 rounded-lg bg-[#1a1a1a]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <FiUser size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userDetails?.fullname}</p>
                <p className="text-xs text-gray-400 truncate">{userDetails?.email}</p>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <FiChevronDown size={16} />
              </button>
            </div>
            {navigationData.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                      : 'text-gray-300 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className="px-3">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Account</p>
            {settingsData.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                      : 'text-gray-300 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-all mt-2"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Stats Card - Fixed at bottom */}
        <div className="relative z-20 p-4 flex-shrink-0 border-t border-[#222222] bg-[#111111]">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 mb-3 shadow-lg">
            <p className="text-sm font-semibold mb-1">Storage Usage</p>
            <p className="text-xs opacity-90 mb-2">2.5 GB of 5 GB used</p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white shadow-sm" style={{ width: '50%' }}></div>
            </div>
          </div>

          {/* User Profile */}
        </div>
      </aside>
    </>
  );
}
