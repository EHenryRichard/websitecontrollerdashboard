'use client';
import { FiSearch, FiBell, FiPlus, FiList, FiUsers, FiGlobe } from 'react-icons/fi';
import { useGlobalUI } from '../../contexts/GlobalUIProvider';
import { useRouter } from 'next/navigation';

export default function TopBar({
  title,
  description,
  showAddButton = true,
  onAddClick,
  showToggleButton = false,
  onToggleClick,
  showViewClientsButton = false,
  showSearchButton = false,
  showViewSitesButton = false,
  onViewSitesClick,
}) {
  const { setNotificationOpen, setSearchOpen } = useGlobalUI();
  const router = useRouter();

  
  return (
    <div className="h-16 bg-[#0f0f0f] border-b border-[#222222] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Toggle Side Panel Button */}
        {showToggleButton && (
          <button onClick={onToggleClick} className="md:hidden text-gray-400 hover:text-white">
            <FiList size={24} />
          </button>
        )}

        <div>
          <h2 className="text-lg md:text-xl font-semibold capitalize">{title}</h2>
          <p className="text-xs text-gray-400 hidden sm:block">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {showSearchButton && (
          <button
            onClick={() => setSearchOpen(true)}
            className="text-gray-400 hover:text-white hidden sm:block"
          >
            <FiSearch size={20} />
          </button>
        )}

        {/* <button
          onClick={() => setNotificationOpen(true)}
          className="relative text-gray-400 hover:text-white"
        >
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button> */}
        {showViewClientsButton && (
          <button
            onClick={() => router.push('/dashboard/view-clients')}
            className="px-3 md:px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <FiUsers size={18} />
            <span className="hidden sm:inline">View Clients</span>
            <span className="sm:hidden">Clients</span>
          </button>
        )}
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="px-3 md:px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <FiPlus size={18} />
            <span className="hidden sm:inline">Add Site</span>
            <span className="sm:hidden">Add Site</span>
          </button>
        )}
        {showViewSitesButton && (
          <button
            onClick={onViewSitesClick}
            className="px-3 md:px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <FiGlobe size={18} />
            <span className="hidden sm:inline">View Sites</span>
            <span className="sm:hidden">View Sites</span>
          </button>
        )}
      </div>
    </div>
  );
}
