import { Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * TaskCard Component
 * 
 * Displays individual task information in a card format
 * Features:
 * - Priority badge with color coding
 * - Status badge with visual indicators
 * - Due date display with calendar icon
 * - Complete/uncomplete toggle
 * - Delete button
 * - Smooth animations and hover effects
 */
const TaskCard = forwardRef(({ task, taskNumber, onDelete, onToggleComplete }, ref) => {
  // Format the due date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is today, tomorrow, or past
    if (date.toDateString() === today.toDateString()) {
      return { text: 'Today', isUrgent: true };
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { text: 'Tomorrow', isUrgent: true };
    } else if (date < today) {
      return { text: date.toLocaleDateString(), isOverdue: true };
    }
    
    return { text: date.toLocaleDateString(), isUrgent: false };
  };

  const dateInfo = formatDate(task.dueDate);

  // Get badge classes based on priority
  const priorityBadgeClass = {
    High: 'badge-priority-high',
    Medium: 'badge-priority-medium',
    Low: 'badge-priority-low',
  }[task.priority];

  // Get badge classes based on status
  const statusBadgeClass = {
    Pending: 'badge-status-pending',
    Completed: 'badge-status-completed',
  }[task.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`card p-5 ${task.status === 'Completed' ? 'opacity-75' : ''}`}
    >
      {/* Header: Number, Title and Delete Button */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Task Number (only for pending tasks) */}
          {taskNumber && (
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
              {taskNumber}
            </div>
          )}

          {/* Complete/Uncomplete Button */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-0.5 text-gray-400 hover:text-primary-600 transition-colors"
            title={task.status === 'Completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'Completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Task Title */}
          <h3 className={`text-lg font-semibold text-gray-900 flex-1 ${
            task.status === 'Completed' ? 'line-through text-gray-500' : ''
          }`}>
            {task.title}
          </h3>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-gray-600 mb-4 ${taskNumber ? 'ml-14' : 'ml-8'} ${
          task.status === 'Completed' ? 'line-through text-gray-400' : ''
        }`}>
          {task.description}
        </p>
      )}

      {/* Footer: Badges and Due Date */}
      <div className={`flex flex-wrap items-center gap-2 ${taskNumber ? 'ml-14' : 'ml-8'}`}>
        {/* Priority Badge */}
        <span className={priorityBadgeClass}>
          <span className={`w-2 h-2 rounded-full ${
            task.priority === 'High' ? 'bg-red-500' :
            task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
          }`}></span>
          {task.priority}
        </span>

        {/* Status Badge */}
        <span className={statusBadgeClass}>
          {task.status}
        </span>

        {/* Due Date */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${
          dateInfo.isOverdue ? 'text-red-600' :
          dateInfo.isUrgent ? 'text-orange-600' : 'text-gray-600'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{dateInfo.text}</span>
          {dateInfo.isOverdue && <span className="text-red-600 font-bold ml-1">⚠ Overdue</span>}
        </div>
      </div>

    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;

