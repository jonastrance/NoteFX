import React from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { mockAnalyticsData } from './lib/mockData';

const App: React.FC = () => (
  <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10">
    <div className="mx-auto max-w-7xl">
      <AnalyticsDashboard data={mockAnalyticsData} />
    </div>
  </main>
);

export default App;
