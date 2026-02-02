'use client';

import { useState } from 'react';
import IntegrationsTab from './IntegrationsTab';
import PasswordTab from './PasswordTab';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'password'>('integrations');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'integrations'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'password' && <PasswordTab />}
    </div>
  );
}
