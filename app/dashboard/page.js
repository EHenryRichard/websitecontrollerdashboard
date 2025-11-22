'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import { FiGlobe, FiDatabase, FiMessageSquare, FiClock, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthProvider';
import { useData } from '../contexts/DataProvider';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { sites, clients, isLoadingSites, isLoadingClients } = useData();
  const router = useRouter();

  // console.log(isAuthenticated, isLoading);

  // Protect this page - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* <TopBar
        title="Dashboard"
        description="Overview of your sites and activities"
        showAddButton={false}
      /> */}

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiGlobe size={24} className="text-blue-500" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Sites</p>
            <p className="text-3xl font-bold">{isLoadingSites ? '...' : sites.length}</p>
            <p className="text-gray-500 text-sm mt-2">Managed websites</p>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiUsers size={24} className="text-orange-500" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Clients</p>
            <p className="text-3xl font-bold">{isLoadingClients ? '...' : clients.length}</p>
            <p className="text-gray-500 text-sm mt-2">Registered clients</p>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiDatabase size={24} className="text-purple-500" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Active Sites</p>
            <p className="text-3xl font-bold">
              {isLoadingSites ? '...' : sites.filter((s) => s.status === 'active').length}
            </p>
            <p className="text-green-500 text-sm mt-2">Currently active</p>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiClock size={24} className="text-green-500" />
            </div>
            <p className="text-gray-400 text-sm mb-1">Inactive Sites</p>
            <p className="text-3xl font-bold">
              {isLoadingSites ? '...' : sites.filter((s) => s.status !== 'active').length}
            </p>
            <p className="text-yellow-500 text-sm mt-2">Needs attention</p>
          </div>
        </div>

        {/* Recent Sites */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Sites</h3>
            <button
              onClick={() => router.push('/dashboard/sites')}
              className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
            >
              View All
            </button>
          </div>
          {isLoadingSites ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <FiClock className="animate-spin mr-2" size={18} />
              Loading sites...
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-8">
              <FiGlobe className="mx-auto text-gray-600 mb-3" size={48} />
              <p className="text-gray-400 mb-4">No sites added yet</p>
              <button
                onClick={() => router.push('/dashboard/sites')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              >
                Add Your First Site
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sites.slice(0, 5).map((site) => {
                const client = clients.find((c) => c.clientId === site.clientId);
                return (
                  <div
                    key={site.siteId}
                    className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222222] transition-colors cursor-pointer"
                    onClick={() => router.push('/dashboard/sites')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <FiGlobe className="text-blue-500" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{site.siteName || site.siteUrl}</p>
                        <p className="text-xs text-gray-400">
                          {client ? client.name : 'Unknown Client'} •{' '}
                          {site.hostingProvider || 'No provider'}
                        </p>
                      </div>
                    </div>
                    <div>
                      {site.status === 'active' ? (
                        <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/10 border border-gray-500/30 rounded-full text-gray-500 text-xs">
                          {site.status || 'Inactive'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
