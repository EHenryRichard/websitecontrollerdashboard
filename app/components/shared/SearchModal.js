'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiSearch } from 'react-icons/fi';
import { useGlobalUI } from '../../contexts/GlobalUIProvider';
import {
  navigationData,
  settingsData,
} from '../../data/data';

export default function SearchModal() {
  const router = useRouter();
  const { searchOpen, setSearchOpen } = useGlobalUI();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(
    []
  );

  // Combine all searchable items
  const searchableItems = [
    ...navigationData.map((item) => ({
      ...item,
      category: 'Pages',
    })),
    ...settingsData.map((item) => ({
      ...item,
      category: 'Settings',
    })),
    // Add more searchable content here
    {
      name: 'add-site',
      label: 'Add New Site',
      href: '/sites',
      category: 'Actions',
    },
    {
      name: 'configure-backup',
      label: 'Configure Backup',
      href: '/backups',
      category: 'Actions',
    },
  ];

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = searchableItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    setFilteredResults(results);
  }, [searchQuery]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () =>
      window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  const handleNavigate = (href) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery('');
  };

  if (!searchOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setSearchOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-2xl bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl animate-slide-down">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[#222222]">
            <FiSearch className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search pages, actions, settings..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              autoFocus
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() === '' ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm mb-2">
                  Start typing to search
                </p>
                <p className="text-xs text-gray-500">
                  Try searching for pages, actions, or
                  settings
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm">
                  No results found for "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="p-2">
                {/* Group by category */}
                {['Pages', 'Actions', 'Settings'].map(
                  (category) => {
                    const items = filteredResults.filter(
                      (item) => item.category === category
                    );
                    if (items.length === 0) return null;

                    return (
                      <div key={category} className="mb-4">
                        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                          {category}
                        </p>
                        {items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.name}
                              onClick={() =>
                                handleNavigate(item.href)
                              }
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left hover:bg-[#1a1a1a] transition-colors group"
                            >
                              {Icon && (
                                <Icon
                                  size={18}
                                  className="text-gray-400 group-hover:text-orange-500"
                                />
                              )}
                              <span className="flex-1 text-sm text-gray-300 group-hover:text-white">
                                {item.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {item.href}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Footer Hint */}
          <div className="p-3 border-t border-[#222222] bg-[#0a0a0a] flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-2 py-1 bg-[#1a1a1a] rounded border border-[#222222]">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span>
                <kbd className="px-2 py-1 bg-[#1a1a1a] rounded border border-[#222222]">
                  ↵
                </kbd>{' '}
                Select
              </span>
            </div>
            <span>
              <kbd className="px-2 py-1 bg-[#1a1a1a] rounded border border-[#222222]">
                ESC
              </kbd>{' '}
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
