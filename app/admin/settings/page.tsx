'use client';

import { useState } from 'react';
import IntegrationsTab from './IntegrationsTab';

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <IntegrationsTab />
    </div>
  );
}
