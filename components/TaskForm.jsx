
'use client';

import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { X, Calendar, Flag, Star, AlignLeft } from 'lucide-react';

export default function TaskForm({ isOpen, onClose, task = null }) {
  const { addTask, updateTask } = useTaskStore();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'none',
    starred: task?.starred || false,
    listId: task?.listId || 'inbox'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (task) {
      updateTask(task.id, formData);
    } else {
      addTask({
        ...formData,
        completed: false,
        createdAt: new Date().toISOString()
      });
    }

    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'none',
      starred: false,
      listId: 'inbox'
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full text-lg font-medium bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex items-start space-x-3">
            <AlignLeft className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="flex-1 bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center space-x-3">
            <Flag className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300"
            >
              <option value="none">No Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Starred */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleChange('starred', !formData.starred)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star className={`w-5 h-5 ${formData.starred ? 'fill-current text-yellow-500' : ''}`} />
              <span>Star this task</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {task ? 'Update' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
