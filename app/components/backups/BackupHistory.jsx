'use client';

import { FiRefreshCw, FiCheckCircle, FiXCircle, FiDownload, FiMail } from 'react-icons/fi';

const BackupHistoryItem = ({ backup }) => {
  const { id, status, timestamp, type, s3Url, emailSent } = backup;
  const date = new Date(timestamp).toLocaleString();

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          {status === 'completed' ? (
            <FiCheckCircle className="text-green-500" size={20} />
          ) : (
            <FiXCircle className="text-red-500" size={20} />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {type === 'manual' ? 'Manual Backup' : 'Automatic Backup'}
          </p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {s3Url && (
          <a
            href={s3Url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
          >
            <FiDownload size={14} />
            <span className="text-xs">Download</span>
          </a>
        )}
        {emailSent && (
          <div className="flex items-center gap-2 text-gray-400">
            <FiMail size={14} />
            <span className="text-xs">Email Sent</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BackupHistory({ backups, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-400">
          <FiRefreshCw className="animate-spin" size={20} />
          <span>Loading backup history...</span>
        </div>
      </div>
    );
  }

  if (backups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No backup history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">Backup History</h3>
      {backups.map((backup) => (
        <BackupHistoryItem key={backup.id} backup={backup} />
      ))}
    </div>
  );
}
