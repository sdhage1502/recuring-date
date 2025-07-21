
'use client';

import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { 
  Calendar, 
  Clock, 
  Flag, 
  MoreHorizontal, 
  Star,
  CheckCircle2,
  Circle
} from 'lucide-react';

export default function TaskList({ searchQuery }) {
  const { tasks, updateTask, deleteTask, selectedList } = useTaskStore();
  const [hoveredTask, setHoveredTask] = useState(null);

  // Filter tasks based on selected list and search query
  const filteredTasks = tasks.filter(task => {
    const matchesList = selectedList === 'inbox' || task.listId === selectedList;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesList && matchesSearch;
  });

  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    updateTask(taskId, { completed: !task.completed });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No matching tasks' : 'All done for today!'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Take a break or add a new task to get started.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
            className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              task.completed 
                ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-75' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <button
                onClick={() => handleToggleComplete(task.id)}
                className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium transition-colors ${
                      task.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h4>
                    
                    {task.description && (
                      <p className={`mt-1 text-sm ${
                        task.completed 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {task.description}
                      </p>
                    )}

                    {/* Task Meta */}
                    <div className="mt-2 flex items-center space-x-4 text-xs">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      {task.priority && task.priority !== 'none' && (
                        <div className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                          <Flag className="w-3 h-3" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      )}
                      
                      {task.starred && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {hoveredTask === task.id && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => updateTask(task.id, { starred: !task.starred })}
                        className="p-1 text-gray-400 hover:text-yellow-500 rounded transition-colors"
                      >
                        <Star className={`w-4 h-4 ${task.starred ? 'fill-current text-yellow-500' : ''}`} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
