'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import {
  FiGlobe,
  FiUser,
  FiMail,
  FiLock,
  FiServer,
  FiDatabase,
  FiShield,
  FiCalendar,
  FiRefreshCw,
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthProvider';
import { useData } from '@/contexts/DataProvider';
import axiosInstance from '@/utils/axiosInstance';
import { showSuccess, showError } from '@/utils/toast';

export default function ViewSitePage() {
  const router = useRouter();
  const params = useParams();
  const { siteId } = params;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { clients, fetchSiteWithId, isLoadingSiteWithId } = useData();
  const [site, setSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({});

  // Protect this page - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // create function to fetch the site with id
  const fetchsiteDetail = async () => {
    try {
      const response = await fetchSiteWithId(siteId);
      const siteData = response;
      setSite(siteData);
    } catch (error) {
      // return to site page if the data is not retrieved
      router.push('/dashboard/sites');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch site details
  useEffect(() => {
    if (siteId && isAuthenticated) {
      fetchsiteDetail();
    }
  }, [siteId, isAuthenticated]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/sites/${siteId}`);
      showSuccess('Site deleted successfully');
      router.push('/dashboard/sites');
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to delete site');
    }
  };

  // Show loading state
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

  // Don't render if not authenticated or no site
  if (!isAuthenticated || !site) {
    return null;
  }

  const client = clients.find((c) => c.clientId === site.clientId);
  const nameservers = JSON.parse(site.nameservers);
  const ftpAccounts = JSON.parse(site.ftpAccounts);
  const databases = JSON.parse(site.databases);

  const InfoCard = ({ icon: Icon, label, value, isPassword, fieldKey }) => (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-gray-400" size={16} />
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      {isPassword ? (
        <div className="flex items-center gap-2">
          <p className="text-sm text-white break-all flex-1">
            {showPasswords[fieldKey] ? value || 'Not set' : '••••••••'}
          </p>
          {value && (
            <button
              onClick={() => togglePasswordVisibility(fieldKey)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showPasswords[fieldKey] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-white break-all">{value || 'Not set'}</p>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar
        title={site.siteName || site.siteUrl}
        description={`Site details for ${site.siteUrl}`}
        showAddButton={false}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] rounded-lg text-gray-300 transition-colors"
            >
              <FiArrowLeft size={18} />
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/sites/edit/${siteId}`)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors"
              >
                <FiEdit size={18} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-colors"
              >
                <FiTrash2 size={18} />
                Delete
              </button>
            </div>
          </div>

          {/* Client Information */}
          {client && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Client Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-500 font-semibold text-lg">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.email}</p>
                  <p className="text-xs text-gray-500">ID: #{client.clientId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard icon={FiGlobe} label="Site Name" value={site.siteName} />
              <InfoCard icon={FiGlobe} label="Site URL" value={site.siteUrl} />
              <InfoCard
                icon={FiCalendar}
                label="Status"
                value={
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      site.status === 'active'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {site.status}
                  </span>
                }
              />
            </div>
          </div>

          {/* Hosting Information */}
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Hosting Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard icon={FiServer} label="Hosting Provider" value={site.hostingProvider} />
              <InfoCard icon={FiServer} label="Hosting Plan" value={site.hostingPlan} />
              <InfoCard icon={FiCalendar} label="Expiry Date" value={site.expiryDate} />
            </div>
          </div>

          {/* Nameservers */}
          {nameservers && nameservers.length > 0 && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Nameservers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nameservers.map((ns, index) => (
                  <InfoCard
                    key={index}
                    icon={FiServer}
                    label={`Nameserver ${index + 1}`}
                    value={ns}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Admin & cPanel Credentials */}
          {(site.adminEmail || site.cpanelUrl) && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Admin & cPanel Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard icon={FiMail} label="Admin Email" value={site.adminEmail} />
                <InfoCard
                  icon={FiLock}
                  label="Admin Password"
                  value={site.adminPassword}
                  isPassword
                  fieldKey="adminPassword"
                />
                <InfoCard icon={FiServer} label="cPanel URL" value={site.cpanelUrl} />
                <InfoCard icon={FiUser} label="cPanel Username" value={site.cpanelUsername} />
                <InfoCard
                  icon={FiLock}
                  label="cPanel Password"
                  value={site.cpanelPassword}
                  isPassword
                  fieldKey="cpanelPassword"
                />
              </div>
            </div>
          )}

          {/* Webmail Credentials */}
          {(site.webmailEmail || site.webmailPassword) && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Webmail Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={FiMail} label="Webmail Email" value={site.webmailEmail} />
                <InfoCard
                  icon={FiLock}
                  label="Webmail Password"
                  value={site.webmailPassword}
                  isPassword
                  fieldKey="webmailPassword"
                />
              </div>
            </div>
          )}

          {/* FTP Accounts */}
          {ftpAccounts && ftpAccounts.length > 0 && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">FTP Accounts</h3>
              {ftpAccounts.map((ftp, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    FTP Account {index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard icon={FiServer} label="FTP Host" value={ftp.ftpHost} />
                    <InfoCard icon={FiServer} label="FTP Port" value={ftp.ftpPort} />
                    <InfoCard icon={FiUser} label="FTP Username" value={ftp.ftpUsername} />
                    <InfoCard
                      icon={FiLock}
                      label="FTP Password"
                      value={ftp.ftpPassword}
                      isPassword
                      fieldKey={`ftpPassword_${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Databases */}
          {databases && databases.length > 0 && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Databases</h3>
              {databases.map((db, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Database {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard icon={FiDatabase} label="Database Host" value={db.databaseHost} />
                    <InfoCard icon={FiDatabase} label="Database Name" value={db.databaseName} />
                    <InfoCard icon={FiUser} label="Database Username" value={db.databaseUsername} />
                    <InfoCard
                      icon={FiLock}
                      label="Database Password"
                      value={db.databasePassword}
                      isPassword
                      fieldKey={`databasePassword_${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SSL Information */}
          {(site.sslProvider || site.sslExpiryDate) && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">SSL Certificate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={FiShield} label="SSL Provider" value={site.sslProvider} />
                <InfoCard icon={FiCalendar} label="SSL Expiry Date" value={site.sslExpiryDate} />
              </div>
            </div>
          )}

          {/* Notes */}
          {site.notes && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Additional Notes</h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{site.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
