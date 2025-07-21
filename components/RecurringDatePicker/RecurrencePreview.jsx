
'use client';

import { format } from 'date-fns';
import { formatRecurrenceDescription } from './utils';

export default function RecurrencePreview({ config, recurringDates = [] }) {
  const description = formatRecurrenceDescription(config);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Recurrence Summary
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {description}
      </p>
      
      {recurringDates.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Next {Math.min(5, recurringDates.length)} occurrences:
          </p>
          <div className="space-y-1">
            {recurringDates.slice(0, 5).map((date, index) => (
              <div key={index} className="text-xs text-gray-700 dark:text-gray-300">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </div>
            ))}
            {recurringDates.length > 5 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ... and {recurringDates.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
