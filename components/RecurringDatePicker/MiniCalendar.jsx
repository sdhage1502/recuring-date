
'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MiniCalendar({ recurringDates = [], startDate }) {
  const [currentMonth, setCurrentMonth] = useState(startDate ? new Date(startDate) : new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for the month to properly align calendar
  const startDay = monthStart.getDay();
  const emptyCells = Array(startDay).fill(null);

  const isRecurringDate = (date) => {
    return recurringDates.some(recurringDate => isSameDay(date, recurringDate));
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month start */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-8"></div>
        ))}
        
        {/* Days of the month */}
        {daysInMonth.map((date) => {
          const isRecurring = isRecurringDate(date);
          const isToday = isSameDay(date, new Date());
          
          return (
            <div
              key={date.toISOString()}
              className={`h-8 flex items-center justify-center text-xs rounded transition-colors ${
                isRecurring
                  ? 'bg-blue-600 text-white font-medium'
                  : isToday
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Recurring</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}
