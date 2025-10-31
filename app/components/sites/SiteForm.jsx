'use client';
import { FiSave } from 'react-icons/fi';

export default function SiteForm({ onCancel, onSave }) {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Add New Site
        </h2>
        <p className="text-gray-400 text-sm">
          Enter the details for your client's website
        </p>
      </div>

      <div className="space-y-6">
        {/* Site Name and URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Site Name{' '}
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Client ABC Website"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Site URL{' '}
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="url"
              placeholder="https://clientabc.com"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Admin Email and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Admin Email{' '}
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="email"
              placeholder="admin@clientabc.com"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Admin Phone
            </label>
            <input
              type="tel"
              placeholder="+234 XXX XXX XXXX"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>
          <select className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes
          </label>
          <textarea
            rows={4}
            placeholder="Add any notes about this site..."
            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FiSave size={18} />
            <span>Save Site</span>
          </button>
        </div>
      </div>
    </div>
  );
}
