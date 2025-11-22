'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiGlobe,
  FiServer,
  FiCalendar,
  FiEdit,
  FiEye,
  FiSearch,
} from 'react-icons/fi';

export default function SitesList({ sites }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sites based on search query
  const filteredSites = sites.filter(
    (site) =>
      site.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.siteUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.hostingProvider?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewSite = (siteId) => {
    router.push(`/dashboard/viewSite/${siteId}`);
  };

  const handleEditSite = (siteId) => {
    router.push(`/dashboard/sites/edit/${siteId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-4">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search sites by name, URL, or hosting provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Sites Grid */}
      {filteredSites.length === 0 ? (
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-12 text-center">
          <FiGlobe className="mx-auto mb-4 text-gray-600" size={48} />
          <h3 className="text-lg font-semibold mb-2">No sites found</h3>
          <p className="text-gray-400">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'No sites available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site) => (
            <div
              key={site.siteId}
              className="bg-[#111111] border border-[#222222] rounded-lg p-6 hover:border-[#333333] transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 truncate">
                    {site.siteName || site.siteUrl}
                  </h3>
                  <a
                    href={`https://${site.siteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1 truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiGlobe size={14} />
                    {site.siteUrl}
                  </a>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    site.status === 'active'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {site.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                {site.hostingProvider && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiServer size={14} />
                    <span className="truncate">{site.hostingProvider}</span>
                  </div>
                )}
                {site.expiryDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiCalendar size={14} />
                    <span>Expires: {site.expiryDate}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-[#222222]">
                <button
                  onClick={() => handleViewSite(site.siteId)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors text-sm font-medium"
                >
                  <FiEye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleEditSite(site.siteId)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] rounded-lg text-gray-300 transition-colors text-sm font-medium"
                >
                  <FiEdit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {sites.length > 0 && (
        <div className="text-center text-sm text-gray-400">
          Showing {filteredSites.length} of {sites.length} site
          {sites.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
