'use client';
import TopBar from '@/components/layout/TopBar';

export default function MessagesPage() {
  return (
    <>
      <TopBar
        title="Messages"
        description="Schedule and send messages to clients"
        showAddButton={false}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            Messages Page
          </h3>
          <p className="text-gray-400">
            Message scheduling will go here.
          </p>
        </div>
      </div>
    </>
  );
}
