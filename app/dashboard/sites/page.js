'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import MiddlePanel from '@/components/layout/MiddlePanel';
import SiteCard from '@/components/sites/SiteCard';
import SiteForm from '@/components/sites/SiteForm';
import SitesList from '@/components/sites/SitesList';
import { FiList, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthProvider';
import { useData } from '@/contexts/DataProvider';

export default function SitesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { sites, isLoadingSites, fetchSites } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Clear selected site on mount to show grid view by default
  useEffect(() => {
    localStorage.removeItem('selectedSiteId');
    setSelectedSite(null);
  }, []);

  // const siteid = fetchSites();
  // Protect this page - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleAddClick = () => {
    setShowForm(true);
    setSidePanelOpen(false); // Close side panel when adding new site
  };

  const handleSiteSelect = (siteId) => {
    setSelectedSite(siteId);
    localStorage.setItem('selectedSiteId', siteId);
    setSidePanelOpen(false); // Close side panel when site selected
  };

  const handleSaveSite = (newSite) => {
    // Sites list is automatically updated by DataProvider
    setShowForm(false);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <FiRefreshCw className="animate-spin" size={20} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Middle Panel - Sites List */}
      <MiddlePanel
        title="All Sites"
        items={sites}
        selectedId={selectedSite}
        onSelect={handleSiteSelect}
        onAdd={handleAddClick}
        searchPlaceholder="Search sites..."
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        renderItem={(site, isSelected, onClick) => (
          <SiteCard key={site.siteId} site={site} isSelected={isSelected} onClick={onClick} />
        )}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title="Sites Manager"
          description="Manage your client websites"
          onAddClick={handleAddClick}
          showToggleButton={true}
          onToggleClick={() => setSidePanelOpen(!sidePanelOpen)}
          site={sites.length}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoadingSites ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-gray-400">
                <FiRefreshCw className="animate-spin" size={20} />
                <span>Loading sites...</span>
              </div>
            </div>
          ) : showForm ? (
            <SiteForm onCancel={() => setShowForm(false)} onSave={handleSaveSite} />
          ) : selectedSite ? (
            <SiteForm
              onCancel={() => {
                setSelectedSite(null);
                localStorage.removeItem('selectedSiteId');
              }}
              onSave={() => {
                // Sites list is automatically updated by DataProvider
                setSelectedSite(null);
                localStorage.removeItem('selectedSiteId');
              }}
            />
          ) : sites.length > 0 ? (
            <SitesList sites={sites} />
          ) : (
            <SiteForm onCancel={() => setShowForm(false)} onSave={handleSaveSite} />
          )}
        </div>
      </div>
    </div>
  );
}
