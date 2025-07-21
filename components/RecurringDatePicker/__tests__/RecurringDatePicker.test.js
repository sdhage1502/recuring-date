
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecurringDatePicker from '../RecurringDatePicker';

// Mock the utility functions
jest.mock('../utils', () => ({
  calculateRecurringDates: jest.fn(() => [
    new Date('2024-01-01'),
    new Date('2024-01-02'),
    new Date('2024-01-03')
  ]),
  formatRecurrenceDescription: jest.fn(() => 'Daily')
}));

describe('RecurringDatePicker Integration', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when open', () => {
    render(<RecurringDatePicker {...defaultProps} />);
    
    expect(screen.getByText('Recurring Date Picker')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date *')).toBeInTheDocument();
    expect(screen.getByText('Calendar Preview')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<RecurringDatePicker {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Recurring Date Picker')).not.toBeInTheDocument();
  });

  test('handles close button click', () => {
    const onClose = jest.fn();
    render(<RecurringDatePicker {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('handles save with valid configuration', async () => {
    const onSave = jest.fn();
    render(<RecurringDatePicker {...defaultProps} onSave={onSave} />);
    
    // Fill in required fields
    const startDateInput = screen.getByLabelText('Start Date *');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    
    // Click daily recurrence type (should be selected by default)
    const dailyButton = screen.getByRole('button', { name: /daily/i });
    fireEvent.click(dailyButton);
    
    // Click save
    const saveButton = screen.getByRole('button', { name: /save recurrence/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            startDate: '2024-01-01',
            type: 'daily'
          }),
          recurringDates: expect.any(Array)
        })
      );
    });
  });

  test('prevents save without required fields', () => {
    render(<RecurringDatePicker {...defaultProps} />);
    
    // Try to save without filling start date
    const saveButton = screen.getByRole('button', { name: /save recurrence/i });
    expect(saveButton).toBeDisabled();
  });

  test('handles reset functionality', async () => {
    render(<RecurringDatePicker {...defaultProps} />);
    
    // Fill in some data
    const startDateInput = screen.getByLabelText('Start Date *');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    
    // Reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(startDateInput.value).toBe('');
    });
  });

  test('changes recurrence type', () => {
    render(<RecurringDatePicker {...defaultProps} />);
    
    // Click weekly button
    const weeklyButton = screen.getByRole('button', { name: /weekly/i });
    fireEvent.click(weeklyButton);
    
    // Should show days of week options
    expect(screen.getByText('On days')).toBeInTheDocument();
  });

  test('handles interval changes', () => {
    render(<RecurringDatePicker {...defaultProps} />);
    
    const intervalInput = screen.getByDisplayValue('1');
    fireEvent.change(intervalInput, { target: { value: '3' } });
    
    expect(intervalInput.value).toBe('3');
  });

  test('displays recurrence preview', () => {
    render(<RecurringDatePicker {...defaultProps} />);
    
    expect(screen.getByText('Recurrence Summary')).toBeInTheDocument();
  });
});
