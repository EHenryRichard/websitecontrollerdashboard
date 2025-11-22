'use client';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import { FiUser, FiMail, FiSend, FiHelpCircle, FiX } from 'react-icons/fi';
import axiosInstance from '@/utils/axiosInstance';
import { showPromise } from '@/utils/toast';

export default function RegisterClientPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegramName: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showTelegramHelp, setShowTelegramHelp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Use showPromise for loading, success, and error states
    showPromise(axiosInstance.post('/clients', formData), {
      loading: 'Registering client...',
      success: (response) => {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          telegramName: '',
        });

        // Get success message from API response
        const successMessage =
          response?.data?.message || response?.data?.msg || 'Client registered successfully!';
        return successMessage;
      },
      error: (error) => {
        // Extract error message
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Failed to register client. Please try again.';

        console.error('Registration error:', error);
        return errorMessage;
      },
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <TopBar
        title="Register Client"
        description="Add new client details to your dashboard"
        showAddButton={false}
        showViewClientsButton={true}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-6">Client Information</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter client's full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Telegram Field (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="telegram" className="block text-sm font-medium text-gray-300">
                    Telegram Username <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTelegramHelp(!showTelegramHelp)}
                    className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    <FiHelpCircle size={14} />
                    How to find?
                  </button>
                </div>

                {/* Help Popup */}
                {showTelegramHelp && (
                  <div className="mb-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => setShowTelegramHelp(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">
                      How to find your Telegram username:
                    </h4>
                    <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside">
                      <li>Open the Telegram app on your phone or desktop</li>
                      <li>Tap on the menu (three horizontal lines) or your profile picture</li>
                      <li>
                        Go to <span className="text-blue-400 font-medium">Settings</span>
                      </li>
                      <li>
                        Look for <span className="text-blue-400 font-medium">Username</span> (it
                        starts with @)
                      </li>
                      <li>
                        If you don't have one, tap{' '}
                        <span className="text-blue-400 font-medium">"Edit"</span> to create it
                      </li>
                    </ol>
                    <p className="text-xs text-gray-400 mt-3">
                      Example: <span className="text-orange-400 font-mono">@johndoe</span>
                    </p>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSend className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    id="telegramName"
                    name="telegramName"
                    value={formData.telegramName}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
              >
                {isLoading ? 'Registering...' : 'Register Client'}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-[#111111] border border-[#222222] rounded-lg p-4">
            <p className="text-sm text-gray-400">
              <span className="text-orange-500 font-semibold">Note:</span> Client information will
              be used to manage website projects and communications. Make sure the email address is
              accurate for important notifications.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
