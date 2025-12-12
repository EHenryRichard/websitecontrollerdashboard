'use client';

import { useState } from 'react';
import { FiSave, FiLoader, FiAlertTriangle } from 'react-icons/fi';

export default function BackupForm({ settings, onSave, onBackupNow, isLoading, error }) {
  const [dbHost, setDbHost] = useState(settings?.dbHost || '');
  const [dbName, setDbName] = useState(settings?.dbName || '');
  const [dbUser, setDbUser] = useState(settings?.dbUser || '');
  const [dbPassword, setDbPassword] = useState(settings?.dbPassword || '');
  const [backupSchedule, setBackupSchedule] = useState(settings?.backupSchedule || 'daily');
  const [autoBackups, setAutoBackups] = useState(settings?.autoBackups || true);
  const [storeOnS3, setStoreOnS3] = useState(settings?.storeOnS3 || false);
  const [s3Bucket, setS3Bucket] = useState(settings?.s3Bucket || '');
  const [s3Region, setS3Region] = useState(settings?.s3Region || '');
  const [s3AccessKey, setS3AccessKey] = useState(settings?.s3AccessKey || '');
  const [s3SecretKey, setS3SecretKey] = useState(settings?.s3SecretKey || '');
  const [sendByEmail, setSendByEmail] = useState(settings?.sendByEmail || false);
  const [recipientEmail, setRecipientEmail] = useState(settings?.recipientEmail || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      dbHost,
      dbName,
      dbUser,
      dbPassword,
      backupSchedule,
      autoBackups,
      storeOnS3,
      s3Bucket,
      s3Region,
      s3AccessKey,
      s3SecretKey,
      sendByEmail,
      recipientEmail,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Database Settings */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Database Backup Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Database Host" value={dbHost} onChange={(e) => setDbHost(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
          <input type="text" placeholder="Database Name" value={dbName} onChange={(e) => setDbName(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
          <input type="text" placeholder="Database User" value={dbUser} onChange={(e) => setDbUser(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
          <input type="password" placeholder="Database Password" value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
        </div>
      </div>

      {/* Backup Schedule */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Backup Schedule</h3>
        <div className="flex items-center gap-4">
          <select value={backupSchedule} onChange={(e) => setBackupSchedule(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="autoBackups" checked={autoBackups} onChange={(e) => setAutoBackups(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
            <label htmlFor="autoBackups" className="text-sm text-gray-300">Automatic Backups</label>
          </div>
        </div>
      </div>

      {/* AWS S3 Settings */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Store on AWS S3</h3>
        <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="storeOnS3" checked={storeOnS3} onChange={(e) => setStoreOnS3(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
            <label htmlFor="storeOnS3" className="text-sm text-gray-300">Store Backups on AWS S3</label>
        </div>
        {storeOnS3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="S3 Bucket Name" value={s3Bucket} onChange={(e) => setS3Bucket(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
            <input type="text" placeholder="S3 Region" value={s3Region} onChange={(e) => setS3Region(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
            <input type="text" placeholder="S3 Access Key" value={s3AccessKey} onChange={(e) => setS3AccessKey(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
            <input type="password" placeholder="S3 Secret Key" value={s3SecretKey} onChange={(e) => setS3SecretKey(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white" />
          </div>
        )}
      </div>

      {/* Email Settings */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Send via Email</h3>
        <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="sendByEmail" checked={sendByEmail} onChange={(e) => setSendByEmail(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
            <label htmlFor="sendByEmail" className="text-sm text-gray-300">Send Backup Files via Email</label>
        </div>
        {sendByEmail && (
          <input type="email" placeholder="Recipient Email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white w-full" />
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-400">
          <FiAlertTriangle size={16} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
            type="button"
            onClick={onBackupNow}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
            {isLoading ? <FiLoader className="animate-spin" /> : 'Backup Now'}
        </button>
        <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
            {isLoading ? <FiLoader className="animate-spin" /> : <FiSave />}
            Save Settings
        </button>
      </div>
    </form>
  );
}
