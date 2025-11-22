'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import { FiSave, FiGlobe, FiUser, FiMail, FiLock, FiServer, FiEye, FiEyeOff, FiPlus, FiTrash2, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthProvider';
import { useData } from '@/contexts/DataProvider';
import axiosInstance from '@/utils/axiosInstance';
import { showSuccess, showError } from '@/utils/toast';

export default function EditSitePage() {
  const router = useRouter();
  const params = useParams();
  const { siteId } = params;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { clients, fetchSites, fetchSiteWithId } = useData();
  const [site, setSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [showPasswords, setShowPasswords] = useState({
    adminPassword: false,
    cpanelPassword: false,
    webmailPassword: false,
  });

  const [formData, setFormData] = useState({
    siteName: '',
    siteUrl: '',
    adminEmail: '',
    adminPassword: '',
    cpanelUrl: '',
    cpanelUsername: '',
    cpanelPassword: '',
    webmailEmail: '',
    webmailPassword: '',
    hostingProvider: '',
    hostingPlan: '',
    expiryDate: '',
    sslProvider: '',
    sslExpiryDate: '',
    status: 'active',
    notes: '',
  });

  const [nameservers, setNameservers] = useState(['', '']);
  const [ftpAccounts, setFtpAccounts] = useState([
    { ftpHost: '', ftpUsername: '', ftpPassword: '', ftpPort: '21' }
  ]);
  const [databases, setDatabases] = useState([
    { databaseHost: '', databaseName: '', databaseUsername: '', databasePassword: '' }
  ]);

  // Protect this page
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch site details
  useEffect(() => {
    const loadSiteDetails = async () => {
      if (siteId && isAuthenticated) {
        try {
          const siteData = await fetchSiteWithId(siteId);
          setSite(siteData);

          // Populate form data
          setFormData({
            siteName: siteData.siteName || '',
            siteUrl: siteData.siteUrl || '',
            adminEmail: siteData.adminEmail || '',
            adminPassword: siteData.adminPassword || '',
            cpanelUrl: siteData.cpanelUrl || '',
            cpanelUsername: siteData.cpanelUsername || '',
            cpanelPassword: siteData.cpanelPassword || '',
            webmailEmail: siteData.webmailEmail || '',
            webmailPassword: siteData.webmailPassword || '',
            hostingProvider: siteData.hostingProvider || '',
            hostingPlan: siteData.hostingPlan || '',
            expiryDate: siteData.expiryDate || '',
            sslProvider: siteData.sslProvider || '',
            sslExpiryDate: siteData.sslExpiryDate || '',
            status: siteData.status || 'active',
            notes: siteData.notes || '',
          });

          // Parse and set arrays
          if (siteData.nameservers) {
            const ns = typeof siteData.nameservers === 'string'
              ? JSON.parse(siteData.nameservers)
              : siteData.nameservers;
            setNameservers(ns.length > 0 ? ns : ['', '']);
          }

          if (siteData.ftpAccounts) {
            const ftp = typeof siteData.ftpAccounts === 'string'
              ? JSON.parse(siteData.ftpAccounts)
              : siteData.ftpAccounts;
            setFtpAccounts(ftp.length > 0 ? ftp : [{ ftpHost: '', ftpUsername: '', ftpPassword: '', ftpPort: '21' }]);
          }

          if (siteData.databases) {
            const db = typeof siteData.databases === 'string'
              ? JSON.parse(siteData.databases)
              : siteData.databases;
            setDatabases(db.length > 0 ? db : [{ databaseHost: '', databaseName: '', databaseUsername: '', databasePassword: '' }]);
          }

          // Find and set client
          const client = clients.find(c => c.clientId === siteData.clientId);
          if (client) {
            setSelectedClient(client);
          }
        } catch (error) {
          showError('Failed to load site details');
          router.push('/dashboard/sites');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (clients.length > 0) {
      loadSiteDetails();
    }
  }, [siteId, isAuthenticated, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Nameserver handlers
  const handleNameserverChange = (index, value) => {
    const updated = [...nameservers];
    updated[index] = value;
    setNameservers(updated);
  };

  const addNameserver = () => {
    setNameservers([...nameservers, '']);
  };

  const removeNameserver = (index) => {
    if (nameservers.length > 1) {
      setNameservers(nameservers.filter((_, i) => i !== index));
    }
  };

  // FTP handlers
  const handleFtpChange = (index, field, value) => {
    const updated = [...ftpAccounts];
    updated[index][field] = value;
    setFtpAccounts(updated);
  };

  const addFtpAccount = () => {
    setFtpAccounts([...ftpAccounts, { ftpHost: '', ftpUsername: '', ftpPassword: '', ftpPort: '21' }]);
  };

  const removeFtpAccount = (index) => {
    if (ftpAccounts.length > 1) {
      setFtpAccounts(ftpAccounts.filter((_, i) => i !== index));
    }
  };

  // Database handlers
  const handleDatabaseChange = (index, field, value) => {
    const updated = [...databases];
    updated[index][field] = value;
    setDatabases(updated);
  };

  const addDatabase = () => {
    setDatabases([...databases, { databaseHost: '', databaseName: '', databaseUsername: '', databasePassword: '' }]);
  };

  const removeDatabase = (index) => {
    if (databases.length > 1) {
      setDatabases(databases.filter((_, i) => i !== index));
    }
  };

  const getVisibleSections = () => {
    const provider = formData.hostingProvider;

    if (!provider) {
      return {
        nameservers: false,
        adminCpanel: false,
        webmail: false,
        ftp: false,
        database: false,
      };
    }

    const sections = {
      nameservers: true,
      adminCpanel: true,
      webmail: true,
      ftp: true,
      database: true,
    };

    if (['aws', 'digitalocean', 'linode', 'vultr', 'cloudways'].includes(provider)) {
      sections.adminCpanel = false;
      sections.webmail = false;
    }

    if (['hostinger'].includes(provider)) {
      sections.adminCpanel = false;
    }

    if (['wpengine', 'kinsta', 'flywheel'].includes(provider)) {
      sections.adminCpanel = false;
    }

    if (['wpengine', 'kinsta'].includes(provider)) {
      sections.ftp = false;
    }

    return sections;
  };

  const visibleSections = getVisibleSections();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient) {
      showError('Please select a client');
      return;
    }

    setIsSaving(true);

    try {
      const siteData = {
        ...formData,
        clientId: selectedClient.clientId,
        nameservers: nameservers.filter(ns => ns.trim() !== ''),
        ftpAccounts: ftpAccounts.filter(ftp => ftp.ftpHost || ftp.ftpUsername),
        databases: databases.filter(db => db.databaseName || db.databaseHost),
      };

      await axiosInstance.put(`/sites/${siteId}`, siteData);

      showSuccess('Site updated successfully!');
      await fetchSites();
      router.push('/dashboard/sites');
    } catch (error) {
      console.error('Update site error:', error);
      showError(error?.response?.data?.message || error?.message || 'Failed to update site');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <FiRefreshCw className="animate-spin" size={20} />
          <span>Loading site details...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !site) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar
        title="Edit Site"
        description={`Editing ${site.siteName || site.siteUrl}`}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] rounded-lg text-gray-300 transition-colors"
            >
              <FiArrowLeft size={18} />
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Client Display */}
            {selectedClient && (
              <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-500 font-semibold">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Client</p>
                    <p className="font-medium text-white">{selectedClient.name}</p>
                    <p className="text-xs text-gray-500">{selectedClient.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    placeholder="Client ABC Website"
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site URL <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="siteUrl"
                    value={formData.siteUrl}
                    onChange={handleChange}
                    placeholder="https://clientabc.com"
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hosting Provider */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
                Hosting Provider <span className="text-orange-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Hosting Provider</label>
                  <select
                    name="hostingProvider"
                    value={formData.hostingProvider}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300"
                    required
                  >
                    <option value="">-- Select Provider First --</option>
                    <optgroup label="Popular Providers">
                      <option value="namecheap">Namecheap</option>
                      <option value="bluehost">Bluehost</option>
                      <option value="hostinger">Hostinger</option>
                      <option value="godaddy">GoDaddy</option>
                      <option value="siteground">SiteGround</option>
                      <option value="hostgator">HostGator</option>
                    </optgroup>
                    <optgroup label="Cloud Providers">
                      <option value="aws">AWS</option>
                      <option value="digitalocean">DigitalOcean</option>
                      <option value="linode">Linode</option>
                      <option value="vultr">Vultr</option>
                      <option value="cloudways">Cloudways</option>
                    </optgroup>
                    <optgroup label="Premium Providers">
                      <option value="wpengine">WP Engine</option>
                      <option value="kinsta">Kinsta</option>
                      <option value="flywheel">Flywheel</option>
                    </optgroup>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hosting Plan</label>
                  <select
                    name="hostingPlan"
                    value={formData.hostingPlan}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300"
                  >
                    <option value="">Select Plan Type</option>
                    <option value="shared">Shared Hosting</option>
                    <option value="vps">VPS</option>
                    <option value="dedicated">Dedicated Server</option>
                    <option value="cloud">Cloud Hosting</option>
                    <option value="wordpress">WordPress Hosting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hosting Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Nameservers */}
            {visibleSections.nameservers && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                  <h3 className="text-lg font-semibold text-white">Nameservers</h3>
                  <button
                    type="button"
                    onClick={addNameserver}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 text-sm transition-colors"
                  >
                    <FiPlus size={16} />
                    Add Nameserver
                  </button>
                </div>
                <div className="space-y-3">
                  {nameservers.map((ns, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">
                          Nameserver {index + 1}
                        </label>
                        <input
                          type="text"
                          value={ns}
                          onChange={(e) => handleNameserverChange(index, e.target.value)}
                          placeholder={`ns${index + 1}.example.com`}
                          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                        />
                      </div>
                      {nameservers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNameserver(index)}
                          className="mt-8 p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin/cPanel Credentials */}
            {visibleSections.adminCpanel && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
                  Admin & cPanel Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@clientsite.com"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.adminPassword ? 'text' : 'password'}
                        name="adminPassword"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('adminPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords.adminPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">cPanel URL</label>
                    <input
                      type="url"
                      name="cpanelUrl"
                      value={formData.cpanelUrl}
                      onChange={handleChange}
                      placeholder="https://cpanel.example.com:2083"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">cPanel Username</label>
                    <input
                      type="text"
                      name="cpanelUsername"
                      value={formData.cpanelUsername}
                      onChange={handleChange}
                      placeholder="cpanel_user"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">cPanel Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.cpanelPassword ? 'text' : 'password'}
                        name="cpanelPassword"
                        value={formData.cpanelPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('cpanelPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords.cpanelPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
                Additional Notes
              </h3>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add any additional notes..."
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave size={18} />
                <span>{isSaving ? 'Saving...' : 'Update Site'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
