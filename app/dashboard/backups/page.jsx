'use client';

import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import { useData } from '@/contexts/DataProvider';
import { FiRefreshCw } from 'react-icons/fi';

// Placeholder for the new card component
const SiteBackupCard = ({ site, onBackupClick }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col justify-between">
    <div>
      <h3 className="font-bold text-lg text-white">{site.name}</h3>
      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm break-all">
        {site.url}
      </a>
    </div>
    <button
      onClick={() => onBackupClick(site)}
      className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors w-full"
    >
      Backup Site
    </button>
  </div>
);


export default function BackupsPage() {
  const { sites, isLoadingSites } = useData();
  const [isBackupTypeModalOpen, setIsBackupTypeModalOpen] = useState(false);
  const [isPseudoCodeModalOpen, setIsPseudoCodeModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const handleBackupClick = (site) => {
    setSelectedSite(site);
    setIsBackupTypeModalOpen(true);
  };

  return (
    <>
      <TopBar
        title="Site Backups"
        description="Create and manage backups for your individual sites."
        showAddButton={false}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {isLoadingSites ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-400">
              <FiRefreshCw className="animate-spin" size={20} />
              <span>Loading sites...</span>
            </div>
          </div>
        ) : sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sites.map((site) => (
              <SiteBackupCard key={site.siteId} site={site} onBackupClick={handleBackupClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-white">No sites found</h3>
            <p className="text-gray-400">Please add a site first to manage backups.</p>
          </div>
        )}
      </div>

      {/* Modals will be implemented and placed here */}
    </>
  );
}
