'use client';

export default function SiteCard({
  site,
  isSelected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 transition-colors border-l-4 ${
        isSelected
          ? 'bg-orange-500/10 border-orange-500 text-white'
          : 'border-transparent text-gray-300 hover:bg-[#1a1a1a]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 text-left">
          <p className="text-sm font-medium mb-1">
            {site.name}
          </p>
          <p className="text-xs text-gray-400">
            {site.url}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            site.status === 'active'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {site.status}
        </span>
      </div>
    </button>
  );
}
