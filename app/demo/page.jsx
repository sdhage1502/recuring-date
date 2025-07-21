
'use client';

import { useState } from 'react';
import RecurringDatePicker from '../../components/RecurringDatePicker/RecurringDatePicker';
import { format } from 'date-fns';

export default function DemoPage() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [savedRecurrences, setSavedRecurrences] = useState([]);

  const handleSaveRecurrence = (recurrenceData) => {
    setSavedRecurrences(prev => [...prev, {
      id: Date.now(),
      ...recurrenceData
    }]);
  };

  const handleDeleteRecurrence = (id) => {
    setSavedRecurrences(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recurring Date Picker Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A comprehensive recurring date picker component similar to TickTick
          </p>
        </div>

        {/* Demo Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Try the Component
          </h2>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Open Recurring Date Picker
          </button>
        </div>

        {/* Saved Recurrences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Saved Recurrences ({savedRecurrences.length})
          </h2>
          
          {savedRecurrences.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No recurrences saved yet. Try creating one!
            </p>
          ) : (
            <div className="space-y-4">
              {savedRecurrences.map((recurrence) => (
                <div
                  key={recurrence.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {recurrence.description}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>Start: {format(new Date(recurrence.config.startDate), 'MMMM d, yyyy')}</p>
                        {recurrence.config.endDate && (
                          <p>End: {format(new Date(recurrence.config.endDate), 'MMMM d, yyyy')}</p>
                        )}
                        <p>Occurrences: {recurrence.recurringDates.length}</p>
                      </div>
                      
                      {/* Next few dates */}
                      {recurrence.recurringDates.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Next occurrences:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {recurrence.recurringDates.slice(0, 5).map((date, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                              >
                                {format(date, 'MMM d')}
                              </span>
                            ))}
                            {recurrence.recurringDates.length > 5 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{recurrence.recurringDates.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeleteRecurrence(recurrence.id)}
                      className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Overview */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Features Implemented
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Recurring Options
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Daily recurrence</li>
                <li>✓ Weekly recurrence</li>
                <li>✓ Monthly recurrence</li>
                <li>✓ Yearly recurrence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Customization Features
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Every X days/weeks/months/years</li>
                <li>✓ Specific days of the week</li>
                <li>✓ Monthly patterns (e.g., "2nd Tuesday")</li>
                <li>✓ Date range with optional end date</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                UI Components
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Mini calendar preview</li>
                <li>✓ Recurrence summary</li>
                <li>✓ Modular component structure</li>
                <li>✓ Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Testing
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Unit tests for utilities</li>
                <li>✓ Integration tests</li>
                <li>✓ Jest configuration</li>
                <li>✓ Testing best practices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Date Picker Modal */}
      <RecurringDatePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSave={handleSaveRecurrence}
      />
    </div>
  );
}
