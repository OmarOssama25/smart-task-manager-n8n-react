import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { ListTodo } from 'lucide-react';

/**
 * TaskList Component
 * 
 * Displays a grid of task cards
 * Features:
 * - Responsive grid layout
 * - Empty state with helpful message
 * - Animated task cards
 * - Passes through task operations to TaskCard
 */
export default function TaskList({ tasks, onDeleteTask, onToggleComplete }) {
  // Show empty state if no tasks at all
  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ListTodo className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
        <p className="text-gray-500">
          Get started by adding your first task above
        </p>
      </div>
    );
  }

  // Calculate task numbers for pending tasks only
  let pendingTaskNumber = 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => {
          // Only increment number for pending tasks
          const taskNumber = task.status === 'Pending' ? ++pendingTaskNumber : null;
          
          return (
            <TaskCard
              key={task.id}
              task={task}
              taskNumber={taskNumber}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

