import { useState } from 'react';
import { CheckCircle2, Cloud, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Navbar Component
 * 
 * Features:
 * - Displays project title and branding
 * - n8n sync button with loading state
 * - Refresh tasks button
 * - Last sync timestamp display
 * - Responsive design with modern styling
 */
export default function Navbar({ onSync, onRefreshTasks, lastSync, isSyncing }) {
  // Format the last sync timestamp for display
  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleString();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Task Manager</h1>
              <p className="text-xs text-gray-500">with n8n Integration</p>
            </div>
          </motion.div>

          {/* Action Buttons and Status */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Last Sync Indicator */}
            {lastSync && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Cloud className="w-4 h-4 text-primary-500" />
                <span className="font-medium">Last Synced:</span>
                <span className="text-gray-500">{formatLastSync(lastSync)}</span>
              </div>
            )}


            {/* Refresh Tasks Button */}
            <button
              onClick={onRefreshTasks}
              disabled={isSyncing}
              className="btn-secondary"
              title="Refresh tasks from Google Sheets"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            {/* Sync with n8n Button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="btn-primary"
              title="Sync tasks with n8n"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>Sync with n8n</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}

