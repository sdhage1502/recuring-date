
import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears, 
  format, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  getDay,
  setDay,
  isBefore,
  isAfter
} from 'date-fns';

export const calculateRecurringDates = (config, maxDates = 50) => {
  const { 
    startDate, 
    endDate, 
    type, 
    interval = 1, 
    daysOfWeek = [], 
    monthPattern = null 
  } = config;

  if (!startDate || !type) return [];

  const dates = [];
  let currentDate = new Date(startDate);
  let iterations = 0;
  const maxIterations = 1000; // Safety limit

  while (dates.length < maxDates && iterations < maxIterations) {
    iterations++;

    // Check if current date is within range
    if (endDate && isAfter(currentDate, new Date(endDate))) {
      break;
    }

    // Check if current date matches criteria
    if (shouldIncludeDate(currentDate, config)) {
      dates.push(new Date(currentDate));
    }

    // Move to next potential date
    currentDate = getNextDate(currentDate, type, interval, config);
  }

  return dates;
};

const shouldIncludeDate = (date, config) => {
  const { type, daysOfWeek = [], monthPattern } = config;

  switch (type) {
    case 'daily':
      return true;

    case 'weekly':
      if (daysOfWeek.length === 0) {
        return true; // If no specific days selected, include all
      }
      return daysOfWeek.includes(getDay(date));

    case 'monthly':
      if (monthPattern) {
        return matchesMonthPattern(date, monthPattern);
      }
      return true;

    case 'yearly':
      return true;

    default:
      return false;
  }
};

const matchesMonthPattern = (date, pattern) => {
  const { occurrence, dayOfWeek } = pattern;
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  const targetDay = getDay(date);
  if (dayOfWeek !== undefined && targetDay !== dayOfWeek) {
    return false;
  }

  // Find all occurrences of the target day in the month
  const occurrences = [];
  let checkDate = setDay(monthStart, targetDay);
  
  // Adjust if the first occurrence is before month start
  if (isBefore(checkDate, monthStart)) {
    checkDate = addWeeks(checkDate, 1);
  }

  while (!isAfter(checkDate, monthEnd)) {
    occurrences.push(new Date(checkDate));
    checkDate = addWeeks(checkDate, 1);
  }

  // Match the occurrence pattern
  switch (occurrence) {
    case 'first':
      return occurrences.length > 0 && isSameDay(date, occurrences[0]);
    case 'second':
      return occurrences.length > 1 && isSameDay(date, occurrences[1]);
    case 'third':
      return occurrences.length > 2 && isSameDay(date, occurrences[2]);
    case 'fourth':
      return occurrences.length > 3 && isSameDay(date, occurrences[3]);
    case 'last':
      return occurrences.length > 0 && isSameDay(date, occurrences[occurrences.length - 1]);
    default:
      return false;
  }
};

const getNextDate = (date, type, interval, config) => {
  switch (type) {
    case 'daily':
      return addDays(date, interval);
    case 'weekly':
      return addWeeks(date, interval);
    case 'monthly':
      return addMonths(date, interval);
    case 'yearly':
      return addYears(date, interval);
    default:
      return addDays(date, 1);
  }
};

export const formatRecurrenceDescription = (config) => {
  const { type, interval = 1, daysOfWeek = [], monthPattern } = config;

  switch (type) {
    case 'daily':
      return interval === 1 ? 'Daily' : `Every ${interval} days`;

    case 'weekly':
      if (daysOfWeek.length === 0) {
        return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
      }
      const dayNames = daysOfWeek.map(day => 
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
      ).join(', ');
      return `Every ${interval === 1 ? '' : interval + ' '}week${interval > 1 ? 's' : ''} on ${dayNames}`;

    case 'monthly':
      if (monthPattern) {
        const { occurrence, dayOfWeek } = monthPattern;
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
        return `The ${occurrence} ${dayName} of every ${interval === 1 ? '' : interval + ' '}month${interval > 1 ? 's' : ''}`;
      }
      return interval === 1 ? 'Monthly' : `Every ${interval} months`;

    case 'yearly':
      return interval === 1 ? 'Yearly' : `Every ${interval} years`;

    default:
      return 'Custom recurrence';
  }
};
