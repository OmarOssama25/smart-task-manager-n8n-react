import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';

/**
 * Main App Component
 * 
 * Smart Task Manager with n8n Integration
 * Features:
 * - Task CRUD operations (Create, Read, Delete, Update)
 * - localStorage persistence
 * - n8n webhook integration for syncing
 * - AI-based task prioritization
 * - Real-time UI updates
 * - Toast notifications
 */
function App() {
  // State Management
  const [tasks, setTasks] = useLocalStorage('smart-tasks', []);
  const [lastSync, setLastSync] = useLocalStorage('last-sync', null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Use ref to prevent duplicate API calls in React Strict Mode
  const hasInitialized = useRef(false);
  const isFetching = useRef(false);

  // n8n webhook URLs - Configured for your n8n instance (PRODUCTION)
  // Note: Environment variables weren't loading on Windows, so hardcoded for now
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://omarossama.app.n8n.cloud/webhook/sync';
  const N8N_GET_TASKS_URL = import.meta.env.VITE_N8N_GET_TASKS_URL || 'https://omarossama.app.n8n.cloud/webhook/get-tasks';
  const N8N_DELETE_TASK_URL = import.meta.env.VITE_N8N_DELETE_TASK_URL || 'https://omarossama.app.n8n.cloud/webhook/delete-task';
  
  // Debug: Log the webhook URLs on component mount
  console.log('✅ N8N Webhook URL:', N8N_WEBHOOK_URL);
  console.log('✅ N8N Get Tasks URL:', N8N_GET_TASKS_URL);
  console.log('✅ N8N Delete Task URL:', N8N_DELETE_TASK_URL);
  console.log('🔧 Env variable:', import.meta.env.VITE_N8N_WEBHOOK_URL);

  /**
   * Fetch tasks from n8n/Google Sheets on app load
   */
  const fetchTasksFromN8n = async () => {
    // Prevent concurrent calls
    if (isFetching.current) {
      console.log('⏳ Already fetching tasks, skipping duplicate call...');
      return;
    }
    
    isFetching.current = true;
    
    try {
      console.log('🔄 Fetching tasks from n8n...');
      
      const response = await fetch(N8N_GET_TASKS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      console.log('📥 Raw response text from n8n:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.log('📭 Empty response from n8n - no tasks in Google Sheets');
        setTasks([]);
        showToast('No tasks found in Google Sheets', 'info');
        setLastSync(new Date().toISOString());
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📥 Parsed JSON from n8n:', data);
      } catch (jsonError) {
        console.error('❌ Invalid JSON response:', responseText);
        throw new Error('Invalid JSON response from n8n');
      }

      // Handle the response format: direct array or wrapped array
      let n8nTasks;
      if (Array.isArray(data) && data.length > 0) {
        // Check if it's a direct array of tasks (new format)
        if (data[0].id && data[0].title) {
          console.log('📥 Detected direct array format from n8n');
          n8nTasks = data; // Direct array format
        } 
        // Check if it's wrapped format (old format)
        else if (data[0].tasks) {
          console.log('📥 Detected wrapped array format from n8n');
          n8nTasks = data[0].tasks; // Wrapped format
        }
      }
      
      if (n8nTasks && Array.isArray(n8nTasks) && n8nTasks.length > 0) {
        // Map n8n task format to our app format (preserve original array order)
        const mappedTasks = n8nTasks.map(task => ({
          id: task.id?.toString() || Date.now().toString(),
          title: task.title?.trim() || '',
          description: task.description || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'Medium',
          status: task.status === 'Synced' ? 'Pending' : task.status || 'Pending', // Convert Synced to Pending
          createdAt: task.createdAt || new Date().toISOString(),
          row_number: task.row_number, // Keep for reference
        }));

        console.log('✅ Mapped tasks:', mappedTasks);
        
        // Update tasks state with fetched data
        setTasks(mappedTasks);
        showToast(`Loaded ${mappedTasks.length} tasks from Google Sheets`, 'success');
        
        // Update last sync timestamp
        setLastSync(new Date().toISOString());
        
      } else {
        console.log('📭 No tasks found in response or empty array');
        setTasks([]);
        showToast('No tasks found in Google Sheets', 'info');
        setLastSync(new Date().toISOString());
      }

    } catch (error) {
      console.error('❌ Error fetching tasks from n8n:', error);
      
      // Don't show error toast on app load if it's just a connection issue
      // Users might be working offline with localStorage
      console.log('ℹ️ Will use locally stored tasks instead');
    } finally {
      // Reset fetching flag
      isFetching.current = false;
    }
  };

  // Fetch tasks from n8n when app loads (prevent duplicate calls in Strict Mode)
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log('🚀 Initializing app - fetching tasks from n8n...');
      hasInitialized.current = true;
      fetchTasksFromN8n();
    }
  }, []); // Empty dependency array - runs once on mount

  /**
   * Add a new task
   */
  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    showToast('Task added successfully!', 'success');
  };

  /**
   * Delete a task by ID
   * Sends the task to n8n before removing it locally
   */
  const handleDeleteTask = async (taskId) => {
    // Find the task to delete
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (!taskToDelete) {
      showToast('Task not found', 'error');
      return;
    }

    try {
      // Send delete request to n8n
      console.log('🗑️ Sending task to n8n for deletion:', taskToDelete);
      
      const response = await fetch(N8N_DELETE_TASK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: taskToDelete,
          action: 'delete',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Delete response from n8n:', result);

      // Remove task locally after successful n8n call
      setTasks(prev => prev.filter(task => task.id !== taskId));
      showToast(result.message || 'Task deleted successfully', 'success');

    } catch (error) {
      console.error('❌ Error deleting task via n8n:', error);
      
      // Still delete locally even if n8n fails (user experience)
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      if (error.message.includes('Failed to fetch')) {
        showToast('Task deleted locally (n8n connection failed)', 'info');
      } else {
        showToast('Task deleted locally (n8n error)', 'info');
      }
    }
  };

  /**
   * Toggle task completion status
   */
  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  /**
   * Sync tasks with n8n workflow
   * 
   * Sends tasks to n8n and gets back the updated/sorted tasks
   */
  const handleSyncWithN8n = async () => {
    setIsSyncing(true);
    
    try {
      // Send current tasks to n8n for processing and get back sorted tasks
      const payload = {
        tasks: tasks,
        syncTimestamp: new Date().toISOString(),
        totalTasks: tasks.length,
      };

      console.log('📤 Sending tasks to n8n for sync processing:', N8N_WEBHOOK_URL);
      console.log('📤 Payload:', payload);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Sync HTTP error! status: ${response.status}`);
      }

      // Check if sync response has content before parsing JSON
      const responseText = await response.text();
      console.log('📥 Sync response text from n8n:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.log('📭 Empty sync response - falling back to get-tasks');
        // If sync doesn't return tasks, fall back to get-tasks endpoint
        await fetchTasksFromN8n();
        showToast('Sync completed - refreshed tasks from n8n', 'success');
        setLastSync(new Date().toISOString());
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📥 Parsed sync response from n8n:', data);
      } catch (jsonError) {
        console.error('❌ Invalid JSON in sync response:', responseText);
        // If sync response is invalid, fall back to get-tasks
        console.log('📭 Falling back to get-tasks due to invalid sync response');
        await fetchTasksFromN8n();
        showToast('Sync completed - refreshed tasks from n8n', 'success');
        setLastSync(new Date().toISOString());
        return;
      }

      // Handle the sync response format: array, single task, or wrapped format
      let n8nTasks;
      
      if (Array.isArray(data) && data.length > 0) {
        // Check if it's a direct array of tasks (new format)
        if (data[0].id && data[0].title) {
          console.log('📥 Detected direct array format from sync response');
          n8nTasks = data; // Direct array format
        } 
        // Check if it's wrapped format (old format)
        else if (data[0].tasks) {
          console.log('📥 Detected wrapped array format from sync response');
          n8nTasks = data[0].tasks; // Wrapped format
        }
      } 
      // Check if it's a single task object (your current n8n setup)
      else if (data && data.id && data.title) {
        console.log('📥 Detected single task object from sync response');
        console.log('📥 Single task received, but sync should return all tasks');
        console.log('📭 Falling back to get-tasks to get complete task list');
        // For single task, we need to get all tasks to maintain proper order
        await fetchTasksFromN8n();
        showToast('Sync completed - refreshed all tasks from n8n', 'success');
        setLastSync(new Date().toISOString());
        return;
      }
      
      if (n8nTasks && Array.isArray(n8nTasks) && n8nTasks.length > 0) {
        // Map n8n task format to our app format (preserve original array order)
        const mappedTasks = n8nTasks.map(task => ({
          id: task.id?.toString() || Date.now().toString(),
          title: task.title?.trim() || '',
          description: task.description || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'Medium',
          status: task.status === 'Synced' ? 'Pending' : task.status || 'Pending', // Convert Synced to Pending
          createdAt: task.createdAt || new Date().toISOString(),
          row_number: task.row_number, // Keep for reference
        }));

        console.log('✅ Mapped synced tasks:', mappedTasks);
        
        // Update tasks state with synced data
        setTasks(mappedTasks);
        showToast(`Synced and loaded ${mappedTasks.length} tasks from n8n!`, 'success');
        
        // Update last sync timestamp
        setLastSync(new Date().toISOString());
        
      } else {
        console.log('📭 No recognizable task data in sync response - falling back to get-tasks');
        // If sync response doesn't contain recognizable tasks, fall back to get-tasks
        await fetchTasksFromN8n();
        showToast('Sync completed - refreshed tasks from n8n', 'success');
        setLastSync(new Date().toISOString());
      }

      console.log('✅ Sync operation completed successfully');

    } catch (error) {
      console.error('Error syncing with n8n:', error);
      
      // Show user-friendly error message
      if (error.name === 'AbortError') {
        showToast('Sync timed out after 30 seconds. Please check your n8n workflow.', 'error');
      } else if (error.message.includes('Failed to fetch')) {
        showToast('Unable to connect to n8n. Please check your webhook URL and internet connection.', 'error');
      } else {
        showToast(`Sync failed: ${error.message}`, 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  };


  /**
   * Show toast notification
   */
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  /**
   * Hide toast notification
   */
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <Navbar
        onSync={handleSyncWithN8n}
        onRefreshTasks={fetchTasksFromN8n}
        lastSync={lastSync}
        isSyncing={isSyncing}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="font-semibold text-gray-700">Total Tasks: </span>
              <span className="text-gray-900">{tasks.length}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="font-semibold text-gray-700">Completed: </span>
              <span className="text-green-600">{tasks.filter(t => t.status === 'Completed').length}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="font-semibold text-gray-700">Pending: </span>
              <span className="text-orange-600">{tasks.filter(t => t.status === 'Pending').length}</span>
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;

