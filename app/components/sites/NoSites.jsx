'use client';
import { FiPlus, FiGlobe } from 'react-icons/fi';

export default function NoSites({ onAddSite }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center bg-[#111111] border border-[#222222] rounded-lg p-12">
        <FiGlobe className="mx-auto mb-6 text-gray-600" size={56} />
        <h2 className="text-2xl font-bold mb-2 text-white">No sites yet</h2>
        <p className="text-gray-400 mb-6">
          Get started by adding your first client website.
        </p>
        <button
          onClick={onAddSite}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold transition-colors"
        >
          <FiPlus size={20} />
          Add Your First Site
        </button>
      </div>
    </div>
  );
}
