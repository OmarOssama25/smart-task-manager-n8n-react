import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TaskForm Component
 * 
 * Collapsible form for adding new tasks
 * Features:
 * - Toggle open/close animation
 * - Input validation
 * - Priority selection
 * - Auto-generated task ID
 * - Clean form reset after submission
 */
export default function TaskForm({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.dueDate) {
      alert('Please fill in the task title and due date');
      return;
    }

    // Create new task object with default status
    const newTask = {
      id: Date.now().toString(), // Simple ID generation
      ...formData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);

    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
    });
    
    // Optionally close form after submission
    // setIsOpen(false);
  };

  // Get minimum date (today) for date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mb-8">
      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="btn-primary w-full sm:w-auto mx-auto flex justify-center"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </motion.button>
      )}

      {/* Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-6 overflow-hidden"
          >
            {/* Form Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Task Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete project documentation"
                  className="input-field"
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add more details about this task..."
                  rows="3"
                  className="input-field resize-none"
                />
              </div>

              {/* Due Date and Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={today}
                    className="input-field"
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Low">🟩 Low</option>
                    <option value="Medium">🟨 Medium</option>
                    <option value="High">🟥 High</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary flex-1 justify-center"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

