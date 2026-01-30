'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  notifyOnNewDeal: boolean;
  notifyOnPriceDrop: boolean;
}

interface AmazonConfig {
  associateTag: string;
  accessKey: string;
  secretKey: string;
  region: string;
  enabled: boolean;
}

interface SyncStatus {
  lastSync: string | null;
  successCount: number;
  failureCount: number;
  isSyncing: boolean;
}

interface LogEntry {
  id: string;
  type: 'telegram' | 'amazon';
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export default function IntegrationsTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'telegram' | 'amazon' | 'sync' | 'logs'>('telegram');
  
  // Telegram settings state
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: '',
    enabled: false,
    notifyOnNewDeal: true,
    notifyOnPriceDrop: true,
  });
  const [telegramStatus, setTelegramStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  
  // Amazon settings state
  const [amazonConfig, setAmazonConfig] = useState<AmazonConfig>({
    associateTag: '',
    accessKey: '',
    secretKey: '',
    region: 'US',
    enabled: false,
  });
  const [amazonStatus, setAmazonStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  
  // Sync status state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    successCount: 0,
    failureCount: 0,
    isSyncing: false,
  });
  
  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'amazon',
      status: 'success',
      message: 'Successfully synced 15 products',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      type: 'telegram',
      status: 'success',
      message: 'Test message sent successfully',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3',
      type: 'amazon',
      status: 'error',
      message: 'Failed to fetch product data for ASIN B000000000',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const testTelegramConnection = async () => {
    setLoading(true);
    setTelegramStatus('testing');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (telegramConfig.botToken && telegramConfig.chatId) {
      setTelegramStatus('connected');
      showMessage('success', 'Telegram connection successful!');
      addLog('telegram', 'success', 'Connection test successful');
    } else {
      setTelegramStatus('disconnected');
      showMessage('error', 'Please enter bot token and chat ID');
    }
    setLoading(false);
  };

  const testAmazonConnection = async () => {
    setLoading(true);
    setAmazonStatus('testing');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (amazonConfig.accessKey && amazonConfig.secretKey && amazonConfig.associateTag) {
      setAmazonStatus('connected');
      showMessage('success', 'Amazon API connection successful!');
      addLog('amazon', 'success', 'API credentials validated');
    } else {
      setAmazonStatus('disconnected');
      showMessage('error', 'Please enter all Amazon credentials');
    }
    setLoading(false);
  };

  const syncAmazonPrices = async () => {
    setLoading(true);
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSyncStatus(prev => ({
      ...prev,
      lastSync: new Date().toISOString(),
      successCount: prev.successCount + Math.floor(Math.random() * 10) + 5,
      failureCount: prev.failureCount + Math.floor(Math.random() * 2),
      isSyncing: false,
    }));
    
    showMessage('success', 'Price sync completed!');
    addLog('amazon', 'success', 'Price sync completed successfully');
    setLoading(false);
  };

  const saveSettings = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    showMessage('success', 'Settings saved successfully!');
    setLoading(false);
  };

  const addLog = (type: 'telegram' | 'amazon', status: 'success' | 'error', message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      status,
      message,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { id: 'telegram', label: 'Telegram', icon: '📱' },
            { id: 'amazon', label: 'Amazon API', icon: '🛒' },
            { id: 'sync', label: 'Sync Status', icon: '🔄' },
            { id: 'logs', label: 'Connection Logs', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab Content */}
      <div className="p-6">
        {/* Telegram Tab */}
        {activeTab === 'telegram' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Telegram Integration</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Connect your Telegram bot to send deal notifications
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`flex items-center space-x-2 text-sm ${
                  telegramStatus === 'connected' ? 'text-green-600' : 
                  telegramStatus === 'testing' ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    telegramStatus === 'connected' ? 'bg-green-500' : 
                    telegramStatus === 'testing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
                  }`}></span>
                  <span>
                    {telegramStatus === 'connected' ? 'Connected' : 
                     telegramStatus === 'testing' ? 'Testing...' : 'Disconnected'}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-900">Enable Telegram</label>
                  <p className="text-sm text-gray-500">Send notifications to Telegram</p>
                </div>
                <button
                  onClick={() => setTelegramConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    telegramConfig.enabled ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      telegramConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Bot Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Token
                </label>
                <input
                  type="password"
                  value={telegramConfig.botToken}
                  onChange={(e) => setTelegramConfig(prev => ({ ...prev, botToken: e.target.value }))}
                  placeholder="Enter your Telegram bot token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your bot token from @BotFather on Telegram
                </p>
              </div>

              {/* Chat ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chat ID
                </label>
                <input
                  type="text"
                  value={telegramConfig.chatId}
                  onChange={(e) => setTelegramConfig(prev => ({ ...prev, chatId: e.target.value }))}
                  placeholder="Enter your chat ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The chat ID where notifications will be sent
                </p>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Notification Preferences</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={telegramConfig.notifyOnNewDeal}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, notifyOnNewDeal: e.target.checked }))}
                      className="h-4 w-4 text-primary rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Notify on new deals</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={telegramConfig.notifyOnPriceDrop}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, notifyOnPriceDrop: e.target.checked }))}
                      className="h-4 w-4 text-primary rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Notify on price drops</span>
                  </label>
                </div>
              </div>

              {/* Test Connection Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={testTelegramConnection}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition disabled:opacity-50"
                >
                  <span>{loading ? 'Testing...' : 'Test Connection'}</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Amazon Tab */}
        {activeTab === 'amazon' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Amazon API Integration</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure your Amazon Associates API credentials
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`flex items-center space-x-2 text-sm ${
                  amazonStatus === 'connected' ? 'text-green-600' : 
                  amazonStatus === 'testing' ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    amazonStatus === 'connected' ? 'bg-green-500' : 
                    amazonStatus === 'testing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
                  }`}></span>
                  <span>
                    {amazonStatus === 'connected' ? 'Connected' : 
                     amazonStatus === 'testing' ? 'Testing...' : 'Disconnected'}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-900">Enable Amazon API</label>
                  <p className="text-sm text-gray-500">Fetch product data and prices from Amazon</p>
                </div>
                <button
                  onClick={() => setAmazonConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    amazonConfig.enabled ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      amazonConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Associate Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associate Tag
                </label>
                <input
                  type="text"
                  value={amazonConfig.associateTag}
                  onChange={(e) => setAmazonConfig(prev => ({ ...prev, associateTag: e.target.value }))}
                  placeholder="Enter your Amazon Associate tag"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Access Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Key ID
                </label>
                <input
                  type="password"
                  value={amazonConfig.accessKey}
                  onChange={(e) => setAmazonConfig(prev => ({ ...prev, accessKey: e.target.value }))}
                  placeholder="Enter your AWS Access Key ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Secret Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secret Access Key
                </label>
                <input
                  type="password"
                  value={amazonConfig.secretKey}
                  onChange={(e) => setAmazonConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="Enter your AWS Secret Access Key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amazon Region
                </label>
                <select
                  value={amazonConfig.region}
                  onChange={(e) => setAmazonConfig(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                </select>
              </div>

              {/* Test Connection Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={testAmazonConnection}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition disabled:opacity-50"
                >
                  <span>{loading ? 'Testing...' : 'Test Connection'}</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sync Status Tab */}
        {activeTab === 'sync' && (
          <SyncStatus 
            syncStatus={syncStatus} 
            onSync={syncAmazonPrices}
            loading={loading}
          />
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Connection Logs</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Recent API connection history and events
                </p>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear Logs
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              {logs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No logs available</p>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <span className={`text-lg ${
                        log.status === 'success' ? '✅' : '❌'
                      }`}></span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium uppercase ${
                            log.type === 'telegram' ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                            {log.type === 'telegram' ? '📱 Telegram' : '🛒 Amazon'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
