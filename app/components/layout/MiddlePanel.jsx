'use client';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';

export default function MiddlePanel({
  title,
  items = [],
  selectedId,
  onSelect,
  onAdd,
  searchPlaceholder = 'Search...',
  isOpen = false,
  onClose,
  renderItem,
}) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-80 bg-[#0f0f0f] border-r border-[#222222] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#222222]">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            {onAdd && (
              <button
                onClick={onAdd}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg text-orange-500"
              >
                <FiPlus size={18} />
              </button>
            )}
            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-[#1a1a1a] rounded-lg text-gray-400"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#222222]">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-sm text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No items found. Click + to add one.
            </div>
          ) : (
            items.map((item) =>
              renderItem(item, selectedId === item.id, () =>
                onSelect(item.id)
              )
            )
          )}
        </div>
      </div>
    </>
  );
}
