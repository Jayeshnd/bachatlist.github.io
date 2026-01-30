'use client';

interface SyncStatusProps {
  syncStatus: {
    lastSync: string | null;
    successCount: number;
    failureCount: number;
    isSyncing: boolean;
  };
  onSync: () => void;
  loading: boolean;
}

export default function SyncStatus({ syncStatus, onSync, loading }: SyncStatusProps) {
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Sync Status</h3>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage product price synchronization
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Successful Syncs</p>
              <p className="text-2xl font-bold text-gray-900">{syncStatus.successCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Failed Syncs</p>
              <p className="text-2xl font-bold text-gray-900">{syncStatus.failureCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🕐</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Sync</p>
              <p className="text-sm font-medium text-gray-900">{formatTimestamp(syncStatus.lastSync)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Sync */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Manual Sync</h4>
            <p className="text-sm text-gray-500 mt-1">
              Trigger a manual price sync for all Amazon products
            </p>
          </div>
          <button
            onClick={onSync}
            disabled={loading || syncStatus.isSyncing}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
              syncStatus.isSyncing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {syncStatus.isSyncing ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Sync Now</span>
              </>
            )}
          </button>
        </div>

        {/* Sync Progress */}
        {syncStatus.isSyncing && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Syncing products...</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Sync Schedule */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Automatic Sync Schedule</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Daily sync at 6:00 AM</span>
            </div>
            <span className="text-xs text-gray-500">Every 24 hours</span>
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Price drop alerts</span>
            </div>
            <span className="text-xs text-gray-500">Real-time monitoring</span>
          </label>
        </div>
      </div>
    </div>
  );
}
