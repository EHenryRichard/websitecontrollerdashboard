'use client';
import TopBar from '@/components/layout/TopBar';

export default function SettingsPage() {
  return (
    <>
      <TopBar
        title="Settings"
        description="Configure your account and preferences"
        showAddButton={false}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            Settings Page
          </h3>
          <p className="text-gray-400">
            Settings configuration will go here.
          </p>
        </div>
      </div>
    </>
  );
}
