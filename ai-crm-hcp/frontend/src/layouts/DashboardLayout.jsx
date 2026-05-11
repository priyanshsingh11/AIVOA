import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">AI-CRM <span className="text-brand-600">HCP</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Welcome, Agent</div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
