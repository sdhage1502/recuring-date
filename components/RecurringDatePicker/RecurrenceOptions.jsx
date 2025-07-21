
'use client';

import { RECURRENCE_TYPES, DAYS_OF_WEEK, MONTH_PATTERNS } from './types';

export default function RecurrenceOptions({ config, onChange }) {
  const { type, interval = 1, daysOfWeek = [], monthPattern } = config;

  const handleTypeChange = (newType) => {
    onChange({
      ...config,
      type: newType,
      interval: 1,
      daysOfWeek: [],
      monthPattern: null
    });
  };

  const handleIntervalChange = (newInterval) => {
    onChange({
      ...config,
      interval: Math.max(1, parseInt(newInterval) || 1)
    });
  };

  const handleDayOfWeekToggle = (dayValue) => {
    const newDaysOfWeek = daysOfWeek.includes(dayValue)
      ? daysOfWeek.filter(d => d !== dayValue)
      : [...daysOfWeek, dayValue].sort();
    
    onChange({
      ...config,
      daysOfWeek: newDaysOfWeek
    });
  };

  const handleMonthPatternChange = (field, value) => {
    onChange({
      ...config,
      monthPattern: {
        ...monthPattern,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Recurrence Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Repeat
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(RECURRENCE_TYPES).map(([key, value]) => (
            <button
              key={value}
              onClick={() => handleTypeChange(value)}
              className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                type === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              {key.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interval */}
      {type && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Every
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={interval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              {type === 'daily' ? 'day(s)' : 
               type === 'weekly' ? 'week(s)' :
               type === 'monthly' ? 'month(s)' : 'year(s)'}
            </span>
          </div>
        </div>
      )}

      {/* Days of Week (for weekly) */}
      {type === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            On days
          </label>
          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                onClick={() => handleDayOfWeekToggle(day.value)}
                className={`px-2 py-2 text-xs rounded-lg border transition-colors ${
                  daysOfWeek.includes(day.value)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month Pattern (for monthly) */}
      {type === 'monthly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pattern (optional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <select
                value={monthPattern?.occurrence || ''}
                onChange={(e) => handleMonthPatternChange('occurrence', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select occurrence</option>
                {MONTH_PATTERNS.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </option>
                ))}
              </select>
              <select
                value={monthPattern?.dayOfWeek !== undefined ? monthPattern.dayOfWeek : ''}
                onChange={(e) => handleMonthPatternChange('dayOfWeek', parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select day</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
