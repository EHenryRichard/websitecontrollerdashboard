'use client';
import TopBar from '@/components/layout/TopBar';
import {
  FiGlobe,
  FiDatabase,
  FiMessageSquare,
  FiClock,
} from 'react-icons/fi';

export default function DashboardPage() {
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
              <FiGlobe
                size={24}
                className="text-blue-500"
              />
            </div>
            <p className="text-gray-400 text-sm mb-1">
              Total Sites
            </p>
            <p className="text-3xl font-bold">8</p>
            <p className="text-green-500 text-sm mt-2">
              ↑ 2 this month
            </p>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiDatabase
                size={24}
                className="text-orange-500"
              />
            </div>
            <p className="text-gray-400 text-sm mb-1">
              Active Backups
            </p>
            <p className="text-3xl font-bold">6</p>
            <p className="text-blue-500 text-sm mt-2">
              All running
            </p>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiMessageSquare
                size={24}
                className="text-purple-500"
              />
            </div>
            <p className="text-gray-400 text-sm mb-1">
              Pending Messages
            </p>
            <p className="text-3xl font-bold">3</p>
            <p className="text-yellow-500 text-sm mt-2">
              2 scheduled today
            </p>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <FiClock
                size={24}
                className="text-green-500"
              />
            </div>
            <p className="text-gray-400 text-sm mb-1">
              Last Backup
            </p>
            <p className="text-3xl font-bold">2h</p>
            <p className="text-gray-400 text-sm mt-2">
              ago
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FiDatabase
                    className="text-green-500"
                    size={18}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Backup completed
                  </p>
                  <p className="text-xs text-gray-400">
                    Client ABC Website • 30 min ago
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FiMessageSquare
                    className="text-blue-500"
                    size={18}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Message sent
                  </p>
                  <p className="text-xs text-gray-400">
                    Client XYZ Shop • 1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
