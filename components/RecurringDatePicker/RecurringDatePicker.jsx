
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DateSelector from './DateSelector';
import RecurrenceOptions from './RecurrenceOptions';
import MiniCalendar from './MiniCalendar';
import RecurrencePreview from './RecurrencePreview';
import { calculateRecurringDates } from './utils';

export default function RecurringDatePicker({ 
  isOpen, 
  onClose, 
  onSave, 
  initialConfig = null 
}) {
  const [config, setConfig] = useState({
    startDate: '',
    endDate: '',
    type: 'daily',
    interval: 1,
    daysOfWeek: [],
    monthPattern: null,
    ...initialConfig
  });

  const [recurringDates, setRecurringDates] = useState([]);

  // Calculate recurring dates whenever config changes
  useEffect(() => {
    if (config.startDate && config.type) {
      const dates = calculateRecurringDates(config);
      setRecurringDates(dates);
    } else {
      setRecurringDates([]);
    }
  }, [config]);

  const handleSave = () => {
    if (!config.startDate || !config.type) {
      alert('Please select a start date and recurrence type');
      return;
    }

    const result = {
      config,
      recurringDates,
      description: require('./utils').formatRecurrenceDescription(config)
    };

    onSave(result);
    onClose();
  };

  const handleReset = () => {
    setConfig({
      startDate: '',
      endDate: '',
      type: 'daily',
      interval: 1,
      daysOfWeek: [],
      monthPattern: null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recurring Date Picker
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
          {/* Left Panel - Configuration */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateSelector
                  label="Start Date *"
                  value={config.startDate}
                  onChange={(value) => setConfig({ ...config, startDate: value })}
                  placeholder="Select start date"
                />
                <DateSelector
                  label="End Date (optional)"
                  value={config.endDate}
                  onChange={(value) => setConfig({ ...config, endDate: value })}
                  placeholder="No end date"
                />
              </div>

              {/* Recurrence Options */}
              <RecurrenceOptions
                config={config}
                onChange={setConfig}
              />

              {/* Preview */}
              <RecurrencePreview
                config={config}
                recurringDates={recurringDates}
              />
            </div>
          </div>

          {/* Right Panel - Calendar Preview */}
          <div className="lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Calendar Preview
            </h3>
            <MiniCalendar
              recurringDates={recurringDates}
              startDate={config.startDate}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Reset
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!config.startDate || !config.type}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Save Recurrence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
