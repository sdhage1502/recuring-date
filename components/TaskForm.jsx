
'use client';

import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { X, Calendar, Flag, Star, AlignLeft, Repeat } from 'lucide-react';
import RecurringDatePicker from './RecurringDatePicker/RecurringDatePicker';

export default function TaskForm({ isOpen, onClose, task = null }) {
  const { addTask, updateTask } = useTaskStore();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'none',
    starred: task?.starred || false,
    listId: task?.listId || 'inbox',
    recurrence: task?.recurrence || null
  });
  const [isRecurringPickerOpen, setIsRecurringPickerOpen] = useState(false);

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

  const handleRecurrenceSave = (recurrenceData) => {
    setFormData(prev => ({ ...prev, recurrence: recurrenceData }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md max-h-screen sm:max-h-[90vh] overflow-y-auto">
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
              className="w-full text-lg sm:text-lg font-medium bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 py-2"
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

          {/* Recurring */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Repeat className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <button
                type="button"
                onClick={() => setIsRecurringPickerOpen(true)}
                className="flex-1 text-left text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {formData.recurrence ? formData.recurrence.description : 'Set recurrence'}
              </button>
              {formData.recurrence && (
                <button
                  type="button"
                  onClick={() => handleChange('recurrence', null)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            {formData.recurrence && (
              <div className="ml-8 text-sm text-gray-500 dark:text-gray-400">
                {formData.recurrence.description}
                {formData.recurrence.recurringDates.length > 0 && (
                  <span className="ml-2">
                    ({formData.recurrence.recurringDates.length} occurrences)
                  </span>
                )}
              </div>
            )}
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

      {/* Recurring Date Picker Modal */}
      <RecurringDatePicker
        isOpen={isRecurringPickerOpen}
        onClose={() => setIsRecurringPickerOpen(false)}
        onSave={handleRecurrenceSave}
        initialConfig={formData.recurrence?.config}
      />
    </div>
  );
}
