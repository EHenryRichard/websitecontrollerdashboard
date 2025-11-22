'use client';
import { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiUser, FiMail, FiLock, FiServer, FiEye, FiEyeOff, FiPlus, FiTrash2 } from 'react-icons/fi';
import ClientSelectionModal from '@/components/modals/ClientSelectionModal';
import { useData } from '@/contexts/DataProvider';
import axiosInstance from '@/utils/axiosInstance';
import { showSuccess, showError } from '@/utils/toast';

export default function SiteForm({ onCancel, onSave }) {
  const { fetchSites, clients } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load selected client from localStorage on mount, or show modal if none saved
  useEffect(() => {
    if (clients.length > 0) {
      const savedClientId = localStorage.getItem('selectedClientId');
      if (savedClientId) {
        const client = clients.find(c => c.clientId === savedClientId);
        if (client) {
          setSelectedClient(client);
          setIsModalOpen(false);
          return;
        }
      }
      // No saved client or saved client not found - show modal
      if (!selectedClient) {
        setIsModalOpen(true);
      }
    }
  }, [clients]);
  const [showPasswords, setShowPasswords] = useState({
    adminPassword: false,
    cpanelPassword: false,
    webmailPassword: false,
    ftpPassword: false,
  });
  const [formData, setFormData] = useState({
    siteName: '',
    siteUrl: '',
    // Admin/cPanel Credentials
    adminEmail: '',
    adminPassword: '',
    cpanelUrl: '',
    cpanelUsername: '',
    cpanelPassword: '',
    // Webmail
    webmailEmail: '',
    webmailPassword: '',
    // Hosting Details
    hostingProvider: '',
    hostingPlan: '',
    expiryDate: '',
    // SSL
    sslProvider: '',
    sslExpiryDate: '',
    // Status and Notes
    status: 'active',
    notes: '',
  });

  // Dynamic arrays for repeatable fields
  const [nameservers, setNameservers] = useState(['', '']);
  const [ftpAccounts, setFtpAccounts] = useState([
    { ftpHost: '', ftpUsername: '', ftpPassword: '', ftpPort: '21' }
  ]);
  const [databases, setDatabases] = useState([
    { databaseHost: '', databaseName: '', databaseUsername: '', databasePassword: '' }
  ]);


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

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    localStorage.setItem('selectedClientId', client.clientId);
    setIsModalOpen(false);
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

  // FTP Account handlers
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

  // Determine which sections to show based on hosting provider
  const getVisibleSections = () => {
    const provider = formData.hostingProvider;

    // If no provider selected, don't show any credential sections
    if (!provider) {
      return {
        nameservers: false,
        adminCpanel: false,
        webmail: false,
        ftp: false,
        database: false,
      };
    }

    // Default: show all sections for traditional hosting providers
    const sections = {
      nameservers: true,
      adminCpanel: true,
      webmail: true,
      ftp: true,
      database: true,
    };

    // Cloud providers (AWS, DigitalOcean, Linode, Vultr, Cloudways)
    if (['aws', 'digitalocean', 'linode', 'vultr', 'cloudways'].includes(provider)) {
      sections.adminCpanel = false; // No cPanel
      sections.webmail = false; // No webmail interface
      // Keep: nameservers, FTP (SSH), database
    }

    // Hostinger uses hPanel, not cPanel
    if (['hostinger'].includes(provider)) {
      sections.adminCpanel = false; // No cPanel (uses hPanel)
      // Keep: nameservers, webmail, FTP, database
    }

    // Managed WordPress providers (WP Engine, Kinsta, Flywheel)
    if (['wpengine', 'kinsta', 'flywheel'].includes(provider)) {
      sections.adminCpanel = false; // No cPanel (they have custom dashboards)
      // Keep: nameservers, webmail, FTP (SFTP), database
    }

    // Premium managed providers typically don't expose FTP
    if (['wpengine', 'kinsta'].includes(provider)) {
      sections.ftp = false; // These use SFTP via their dashboard only
    }

    return sections;
  };

  const visibleSections = getVisibleSections();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // Combine all data including dynamic arrays
      const siteData = {
        ...formData,
        clientId: selectedClient.clientId,
        nameservers: nameservers.filter(ns => ns.trim() !== ''), // Only send non-empty nameservers
        ftpAccounts: ftpAccounts.filter(ftp => ftp.ftpHost || ftp.ftpUsername), // Only send FTP accounts with data
        databases: databases.filter(db => db.databaseName || db.databaseHost), // Only send databases with data
      };

      // Add site via API
      const response = await axiosInstance.post('/sites', siteData);

      // Reset form on success
      setFormData({
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
      // Reset dynamic arrays
      setNameservers(['', '']);
      setFtpAccounts([{ ftpHost: '', ftpUsername: '', ftpPassword: '', ftpPort: '21' }]);
      setDatabases([{ databaseHost: '', databaseName: '', databaseUsername: '', databasePassword: '' }]);
      // Keep selectedClient so user can add multiple sites for same client
      // setSelectedClient(null);

      showSuccess('Site added successfully!');

      // Refresh sites list
      await fetchSites();

      // Call onSave callback
      if (onSave) {
        onSave(response.data);
      }
    } catch (error) {
      console.error('Add site error:', error);
      showError(error?.response?.data?.message || error?.message || 'Failed to add site');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Site</h2>
        <p className="text-gray-400 text-sm">Enter the details for your client's website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Client Display */}
        {selectedClient ? (
          <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-500 font-semibold">
                    {selectedClient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400">Client</p>
                  <p className="font-medium text-white truncate" title={selectedClient.name}>
                    {selectedClient.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate" title={selectedClient.email}>
                    {selectedClient.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] rounded-lg text-gray-300 text-sm transition-colors flex-shrink-0"
              >
                Change Client
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 font-medium">No client selected</p>
                <p className="text-sm text-gray-400 mt-1">Please select a client to continue</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors"
              >
                Select Client
              </button>
            </div>
          </div>
        )}

        {/* Basic Site Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Site Name <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  placeholder="Client ABC Website"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Site URL <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="text-gray-400" size={18} />
                </div>
                <input
                  type="url"
                  name="siteUrl"
                  value={formData.siteUrl}
                  onChange={handleChange}
                  placeholder="https://clientabc.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                  required
                />
              </div>
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

        {/* Hosting Provider Selection - MUST BE SELECTED FIRST */}
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
                  <option value="a2hosting">A2 Hosting</option>
                  <option value="dreamhost">DreamHost</option>
                </optgroup>
                <optgroup label="Cloud Providers">
                  <option value="aws">AWS (Amazon Web Services)</option>
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
                <optgroup label="Other">
                  <option value="other">Other</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hosting Plan</label>
              <select
                name="hostingPlan"
                value={formData.hostingPlan}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300"
                disabled={!formData.hostingProvider}
              >
                <option value="">Select Plan Type</option>
                <option value="shared">Shared Hosting</option>
                <option value="vps">VPS (Virtual Private Server)</option>
                <option value="dedicated">Dedicated Server</option>
                <option value="cloud">Cloud Hosting</option>
                <option value="wordpress">WordPress Hosting</option>
                <option value="reseller">Reseller Hosting</option>
                <option value="managed">Managed Hosting</option>
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
                disabled={!formData.hostingProvider}
              />
            </div>
          </div>

          {/* Provider-specific info message */}
          {formData.hostingProvider ? (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">
                {['aws', 'digitalocean', 'linode', 'vultr', 'cloudways'].includes(formData.hostingProvider) && (
                  <>Cloud providers typically don't use cPanel or webmail interfaces. Fill in SSH/FTP and database details below.</>
                )}
                {['wpengine', 'kinsta', 'flywheel'].includes(formData.hostingProvider) && (
                  <>Managed WordPress hosts use custom dashboards instead of cPanel. Access credentials are managed through their platform.</>
                )}
                {['hostinger'].includes(formData.hostingProvider) && (
                  <>Hostinger uses hPanel instead of cPanel. Fill in the relevant hosting panel credentials below.</>
                )}
                {!['aws', 'digitalocean', 'linode', 'vultr', 'cloudways', 'wpengine', 'kinsta', 'flywheel', 'hostinger'].includes(formData.hostingProvider) && (
                  <>Traditional hosting provider selected. Fill in all relevant hosting details including cPanel, FTP, and database credentials below.</>
                )}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-400 font-medium">Please select a hosting provider first</p>
              <p className="text-sm text-gray-400 mt-1">The form will show only the relevant fields based on your hosting provider.</p>
            </div>
          )}
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
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiServer className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        value={ns}
                        onChange={(e) => handleNameserverChange(index, e.target.value)}
                        placeholder={`ns${index + 1}.example.com`}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                      />
                    </div>
                  </div>
                  {nameservers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNameserver(index)}
                      className="mt-8 p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                      title="Remove nameserver"
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@clientsite.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" size={18} />
                </div>
                <input
                  type={showPasswords.adminPassword ? 'text' : 'password'}
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" size={18} />
                </div>
                <input
                  type={showPasswords.cpanelPassword ? 'text' : 'password'}
                  name="cpanelPassword"
                  value={formData.cpanelPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
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

        {/* Webmail Credentials */}
        {visibleSections.webmail && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
              Webmail Credentials
            </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Webmail Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  name="webmailEmail"
                  value={formData.webmailEmail}
                  onChange={handleChange}
                  placeholder="webmail@clientsite.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Webmail Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" size={18} />
                </div>
                <input
                  type={showPasswords.webmailPassword ? 'text' : 'password'}
                  name="webmailPassword"
                  value={formData.webmailPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('webmailPassword')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPasswords.webmailPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* FTP Details */}
        {visibleSections.ftp && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
              <h3 className="text-lg font-semibold text-white">FTP Accounts</h3>
              <button
                type="button"
                onClick={addFtpAccount}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 text-sm transition-colors"
              >
                <FiPlus size={16} />
                Add FTP Account
              </button>
            </div>
            {ftpAccounts.map((ftp, index) => (
              <div key={index} className="p-4 bg-[#151515] border border-[#2a2a2a] rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-300">FTP Account {index + 1}</h4>
                  {ftpAccounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFtpAccount(index)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs transition-colors"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">FTP Host</label>
                    <input
                      type="text"
                      value={ftp.ftpHost}
                      onChange={(e) => handleFtpChange(index, 'ftpHost', e.target.value)}
                      placeholder="ftp.example.com"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">FTP Port</label>
                    <input
                      type="text"
                      value={ftp.ftpPort}
                      onChange={(e) => handleFtpChange(index, 'ftpPort', e.target.value)}
                      placeholder="21"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">FTP Username</label>
                    <input
                      type="text"
                      value={ftp.ftpUsername}
                      onChange={(e) => handleFtpChange(index, 'ftpUsername', e.target.value)}
                      placeholder="ftp_user"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">FTP Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" size={18} />
                      </div>
                      <input
                        type={showPasswords[`ftpPassword_${index}`] ? 'text' : 'password'}
                        value={ftp.ftpPassword}
                        onChange={(e) => handleFtpChange(index, 'ftpPassword', e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(`ftpPassword_${index}`)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords[`ftpPassword_${index}`] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database Details */}
        {visibleSections.database && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
              <h3 className="text-lg font-semibold text-white">Databases</h3>
              <button
                type="button"
                onClick={addDatabase}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 text-sm transition-colors"
              >
                <FiPlus size={16} />
                Add Database
              </button>
            </div>
            {databases.map((db, index) => (
              <div key={index} className="p-4 bg-[#151515] border border-[#2a2a2a] rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-300">Database {index + 1}</h4>
                  {databases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDatabase(index)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs transition-colors"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Database Host</label>
                    <input
                      type="text"
                      value={db.databaseHost}
                      onChange={(e) => handleDatabaseChange(index, 'databaseHost', e.target.value)}
                      placeholder="localhost"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Database Name</label>
                    <input
                      type="text"
                      value={db.databaseName}
                      onChange={(e) => handleDatabaseChange(index, 'databaseName', e.target.value)}
                      placeholder="db_name"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Database Username</label>
                    <input
                      type="text"
                      value={db.databaseUsername}
                      onChange={(e) => handleDatabaseChange(index, 'databaseUsername', e.target.value)}
                      placeholder="db_user"
                      className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Database Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" size={18} />
                      </div>
                      <input
                        type={showPasswords[`databasePassword_${index}`] ? 'text' : 'password'}
                        value={db.databasePassword}
                        onChange={(e) => handleDatabaseChange(index, 'databasePassword', e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(`databasePassword_${index}`)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords[`databasePassword_${index}`] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SSL Details */}
        {formData.hostingProvider && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-[#2a2a2a] pb-2">
              SSL Certificate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">SSL Provider</label>
                <select
                  name="sslProvider"
                  value={formData.sslProvider}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300"
                >
                  <option value="">Select SSL Provider</option>
                  <option value="letsencrypt">Let's Encrypt (Free)</option>
                  <option value="cloudflare">Cloudflare SSL</option>
                  <option value="comodo">Comodo</option>
                  <option value="digicert">DigiCert</option>
                  <option value="sectigo">Sectigo</option>
                  <option value="godaddy-ssl">GoDaddy SSL</option>
                  <option value="namecheap-ssl">Namecheap SSL</option>
                  <option value="other-ssl">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SSL Expiry Date</label>
                <input
                  type="date"
                  name="sslExpiryDate"
                  value={formData.sslExpiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 [color-scheme:dark]"
                />
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
              placeholder="Add any additional notes about this site..."
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !selectedClient}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave size={18} />
            <span>{isLoading ? 'Saving...' : 'Save Site'}</span>
          </button>
        </div>
      </form>

      {/* Client Selection Modal */}
      <ClientSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectClient={handleSelectClient}
      />
    </div>
  );
}
