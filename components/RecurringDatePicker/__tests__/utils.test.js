
import { calculateRecurringDates, formatRecurrenceDescription } from '../utils';

// Mock date-fns functions for consistent testing
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  addDays: jest.fn((date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }),
  addWeeks: jest.fn((date, weeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + (weeks * 7));
    return result;
  }),
  addMonths: jest.fn((date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }),
  addYears: jest.fn((date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  })
}));

describe('calculateRecurringDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calculates daily recurrence correctly', () => {
    const config = {
      startDate: '2024-01-01',
      type: 'daily',
      interval: 1
    };

    const dates = calculateRecurringDates(config, 5);
    expect(dates).toHaveLength(5);
    expect(dates[0]).toEqual(new Date('2024-01-01'));
  });

  test('calculates weekly recurrence with specific days', () => {
    const config = {
      startDate: '2024-01-01', // Monday
      type: 'weekly',
      interval: 1,
      daysOfWeek: [1, 3, 5] // Mon, Wed, Fri
    };

    const dates = calculateRecurringDates(config, 10);
    expect(dates.length).toBeGreaterThan(0);
  });

  test('respects end date limit', () => {
    const config = {
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      type: 'daily',
      interval: 1
    };

    const dates = calculateRecurringDates(config, 10);
    expect(dates.length).toBeLessThanOrEqual(5);
  });

  test('handles monthly recurrence with pattern', () => {
    const config = {
      startDate: '2024-01-01',
      type: 'monthly',
      interval: 1,
      monthPattern: {
        occurrence: 'first',
        dayOfWeek: 1 // Monday
      }
    };

    const dates = calculateRecurringDates(config, 5);
    expect(dates).toHaveLength(5);
  });

  test('returns empty array for invalid config', () => {
    const config = {};
    const dates = calculateRecurringDates(config);
    expect(dates).toEqual([]);
  });
});

describe('formatRecurrenceDescription', () => {
  test('formats daily recurrence', () => {
    expect(formatRecurrenceDescription({ type: 'daily', interval: 1 }))
      .toBe('Daily');
    
    expect(formatRecurrenceDescription({ type: 'daily', interval: 3 }))
      .toBe('Every 3 days');
  });

  test('formats weekly recurrence', () => {
    expect(formatRecurrenceDescription({ type: 'weekly', interval: 1 }))
      .toBe('Weekly');
    
    expect(formatRecurrenceDescription({ 
      type: 'weekly', 
      interval: 2, 
      daysOfWeek: [1, 3, 5] 
    })).toBe('Every 2 weeks on Mon, Tue, Fri');
  });

  test('formats monthly recurrence with pattern', () => {
    expect(formatRecurrenceDescription({ 
      type: 'monthly', 
      interval: 1,
      monthPattern: { occurrence: 'first', dayOfWeek: 1 }
    })).toBe('The first Monday of every month');
  });

  test('formats yearly recurrence', () => {
    expect(formatRecurrenceDescription({ type: 'yearly', interval: 1 }))
      .toBe('Yearly');
    
    expect(formatRecurrenceDescription({ type: 'yearly', interval: 2 }))
      .toBe('Every 2 years');
  });

  test('handles unknown type', () => {
    expect(formatRecurrenceDescription({ type: 'unknown' }))
      .toBe('Custom recurrence');
  });
});
