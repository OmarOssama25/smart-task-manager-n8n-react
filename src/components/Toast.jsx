import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages
 * Features:
 * - Auto-dismiss after duration
 * - Different types: success, error, info
 * - Animated entry/exit
 * - Manual close button
 * - Icons based on type
 */
export default function Toast({ message, type = 'success', duration = 5000, onClose }) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Get icon based on type
  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  // Get colors based on type
  const colors = {
    success: {
      icon: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    error: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
  }[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 ${colors.bg} ${colors.border} border rounded-lg shadow-xl p-4 flex items-start gap-3 z-50 max-w-md`}
        >
          <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

