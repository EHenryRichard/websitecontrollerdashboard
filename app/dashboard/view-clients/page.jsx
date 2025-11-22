'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import { FiMail, FiCalendar, FiCheck, FiX, FiRefreshCw, FiEye } from 'react-icons/fi';
import { FaTelegram } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthProvider';
import { useData } from '@/contexts/DataProvider';

export default function ViewClientsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { clients, isLoadingClients, fetchClients } = useData();

  // Protect this page - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddClient = () => {
    router.push('/dashboard/register-client');
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
    <>
      <TopBar
        title="View Clients"
        description="Manage and view all registered clients"
        showAddButton={true}
        onAddClick={handleAddClient}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Refresh Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">All Clients</h3>
              <p className="text-sm text-gray-400">
                Total: {clients.length} client{clients.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={fetchClients}
              disabled={isLoadingClients}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] rounded-lg text-gray-300 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={isLoadingClients ? 'animate-spin' : ''} size={16} />
              Refresh
            </button>
          </div>

          {/* Table */}
          {isLoadingClients ? (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-12 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <FiRefreshCw className="animate-spin" size={20} />
                <span>Loading clients...</span>
              </div>
            </div>
          ) : clients.length === 0 ? (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">No clients registered yet</p>
              <button
                onClick={handleAddClient}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              >
                Register Your First Client
              </button>
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1a1a] border-b border-[#333333]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                        Client Name
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                        Telegram
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                        Registered
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]">
                    {clients.map((client) => (
                      <tr key={client.clientId} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                              <span className="text-orange-500 font-semibold">
                                {client.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{client.name}</p>
                              <p className="text-xs text-gray-500">ID: #{client.clientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${client.email}`}
                            className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors"
                          >
                            <FiMail size={14} className="text-gray-500" />
                            <span className="text-sm">{client.email}</span>
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {client.telegramName ? (
                            <div className="flex items-center gap-2 text-blue-400">
                              <FaTelegram size={16} />
                              <a
                                href={`https://t.me/${client.telegramName.replace('@', '')}`}
                                className="text-sm"
                              >
                                {client.telegramName}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {client.isActive ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-xs font-medium">
                              <FiCheck size={12} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-xs font-medium">
                              <FiX size={12} />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiCalendar size={14} />
                            <span className="text-sm">{formatDate(client.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/dashboard/client-sites/${client.clientId}`)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            <FiEye size={14} />
                            View Sites
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-[#222222]">
                {clients.map((client) => (
                  <div key={client.clientId} className="p-4 hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <span className="text-orange-500 font-semibold text-lg">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{client.name}</p>
                          <p className="text-xs text-gray-500">ID: #{client.clientId}</p>
                        </div>
                      </div>
                      {client.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-xs">
                          <FiCheck size={10} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-xs">
                          <FiX size={10} />
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <a
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors"
                      >
                        <FiMail size={14} className="text-gray-500" />
                        {client.email}
                      </a>
                      {client.telegramName ? (
                        <div className="flex items-center gap-2 text-blue-400">
                          <FaTelegram size={14} />
                          <a href={`https://t.me/${client.telegramName.replace('@', '')}`}>
                            {client.telegramName}
                          </a>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs">No Telegram</div>
                      )}
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <FiCalendar size={12} />
                        Registered {formatDate(client.createdAt)}
                      </div>
                    </div>

                    {/* View Sites Button */}
                    <button
                      onClick={() => router.push(`/dashboard/client-sites/${client.clientId}`)}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      <FiEye size={14} />
                      View Sites
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
