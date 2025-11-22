'use client';
import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiUser, FiCheck } from 'react-icons/fi';
import { useData } from '@/contexts/DataProvider';

export default function ClientSelectionModal({ isOpen, onClose, onSelectClient }) {
  const { clients, isLoadingClients } = useData();
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Filter clients based on search query
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.clientId.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleConfirm = () => {
    if (selectedClient) {
      onSelectClient(selectedClient);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedClient(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#222222] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222222]">
          <div>
            <h2 className="text-xl font-bold text-white">Select Client</h2>
            <p className="text-sm text-gray-400 mt-1">Choose a client to associate with this site</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-[#222222]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoadingClients ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading clients...</div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiUser className="text-gray-600 mb-3" size={48} />
              <p className="text-gray-400">
                {searchQuery ? 'No clients found matching your search' : 'No clients available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <button
                  key={client.clientId}
                  onClick={() => handleSelectClient(client)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedClient?.clientId === client.clientId
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : 'bg-[#1a1a1a] border-[#333333] hover:border-[#444444]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-500 font-semibold">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-gray-400">{client.email}</p>
                        <p className="text-xs text-gray-500">ID: #{client.clientId}</p>
                      </div>
                    </div>
                    {selectedClient?.clientId === client.clientId && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                          <FiCheck className="text-white" size={14} />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-[#222222]">
          <p className="text-sm text-gray-400">
            {selectedClient ? (
              <>
                Selected: <span className="text-orange-500 font-medium">{selectedClient.name}</span>
              </>
            ) : (
              'Please select a client'
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] rounded-lg text-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedClient}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
