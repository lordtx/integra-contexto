'use client';

import { useState } from 'react';
import { StatusPanel } from './status-panel';
import { Controls } from './controls';
import { Leaderboard } from './leaderboard';

export default function DashboardPage() {
  const [streamActive, setStreamActive] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-600">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatusPanel streamActive={streamActive} />
          <Controls
            streamActive={streamActive}
            onToggleStream={() => setStreamActive(!streamActive)}
          />
        </div>
        <div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}