'use client';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import MiddlePanel from '@/components/layout/MiddlePanel';
import SiteCard from '@/components/sites/SiteCard';
import SiteForm from '@/components/sites/SiteForm';
import { FiList } from 'react-icons/fi';

export default function SitesPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Mock data - replace with real data later
  const sites = [
    {
      id: 1,
      name: 'Client ABC Website',
      url: 'clientabc.com',
      status: 'active',
    },
    {
      id: 2,
      name: 'Client XYZ Shop',
      url: 'clientxyz.com',
      status: 'active',
    },
    {
      id: 3,
      name: 'Client DEF Portal',
      url: 'clientdef.com',
      status: 'inactive',
    },
  ];

  const handleAddClick = () => {
    setShowForm(true);
    setSidePanelOpen(false); // Close side panel when adding new site
  };

  const handleSiteSelect = (siteId) => {
    setSelectedSite(siteId);
    setSidePanelOpen(false); // Close side panel when site selected
  };

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
          <SiteCard
            key={site.id}
            site={site}
            isSelected={isSelected}
            onClick={onClick}
          />
        )}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          description="Manage your client websites"
          onAddClick={handleAddClick}
          showToggleButton={true}
          onToggleClick={() =>
            setSidePanelOpen(!sidePanelOpen)
          }
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {showForm ? (
            <SiteForm
              onCancel={() => setShowForm(false)}
              onSave={() => {
                // Handle save
                setShowForm(false);
              }}
            />
          ) : selectedSite ? (
            <SiteForm
              onCancel={() => setSelectedSite(null)}
              onSave={() => {
                // Handle save
                setSelectedSite(null);
              }}
            />
          ) : (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">
                Select a Site
              </h3>
              <p className="text-gray-400 mb-4">
                Select a site from the list to edit, or
                click "Add New" to create a new site.
              </p>
              <button
                onClick={() => setSidePanelOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FiList size={18} />
                <span>View All Sites</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
