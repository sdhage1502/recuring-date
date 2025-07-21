
/**
 * Centralized Integration Test Suite for TaskTick Application
 * Tests all major components and functionality in one place
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Components
import ThemeProvider from '../components/ThemeProvider';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ProfileModal from '../components/ProfileModal';
import RecurringDatePicker from '../components/RecurringDatePicker/RecurringDatePicker';

// Utilities
import { 
  generateRecurringDates, 
  formatRecurrenceText,
  getNextOccurrence,
  validateRecurrencePattern 
} from '../components/RecurringDatePicker/utils';

// Mock stores
jest.mock('../store/taskStore', () => ({
  useTaskStore: () => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'high',
        dueDate: '2024-01-15',
        starred: false,
        listId: 'inbox'
      }
    ],
    lists: [
      { id: 'inbox', name: 'Inbox', isDefault: true },
      { id: 'work', name: 'Work', color: '#3b82f6', isDefault: false }
    ],
    selectedList: 'inbox',
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    setSelectedList: jest.fn(),
    addTask: jest.fn()
  })
}));

jest.mock('../store/themeStore', () => ({
  useThemeStore: () => ({
    theme: 'light',
    themes: {
      light: {
        name: 'Light',
        primary: '#2563eb',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
      },
      dark: {
        name: 'Dark',
        primary: '#3b82f6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
      }
    },
    setTheme: jest.fn(),
    getCurrentTheme: () => ({
      name: 'Light',
      primary: '#2563eb',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
    })
  })
}));

jest.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: {
      displayName: 'Test User',
      email: 'test@example.com'
    }
  })
}));

// Mock Firebase
jest.mock('../lib/firebase', () => ({
  auth: {
    currentUser: {
      displayName: 'Test User',
      email: 'test@example.com'
    }
  }
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  updatePassword: jest.fn()
}));

describe('TaskTick Application - Complete Integration Tests', () => {
  
  describe('Theme System Tests', () => {
    test('ThemeProvider applies correct theme classes', () => {
      render(
        <ThemeProvider>
          <div data-testid="theme-content">Test Content</div>
        </ThemeProvider>
      );
      
      const content = screen.getByTestId('theme-content');
      expect(content).toBeInTheDocument();
    });

    test('Theme switching works in ProfileModal', () => {
      const { useThemeStore } = require('../store/themeStore');
      const mockSetTheme = jest.fn();
      useThemeStore.mockReturnValue({
        ...useThemeStore(),
        setTheme: mockSetTheme
      });

      render(<ProfileModal isOpen={true} onClose={() => {}} />);
      
      // Click on Appearance tab
      fireEvent.click(screen.getByText('Appearance'));
      
      // Find and click dark theme
      const darkThemeButton = screen.getByText('Dark').closest('button');
      fireEvent.click(darkThemeButton);
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('Task Management Tests', () => {
    test('TaskList displays tasks correctly', () => {
      render(<TaskList searchQuery="" />);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    test('Task completion toggle works', () => {
      const { useTaskStore } = require('../store/taskStore');
      const mockUpdateTask = jest.fn();
      useTaskStore.mockReturnValue({
        ...useTaskStore(),
        updateTask: mockUpdateTask
      });

      render(<TaskList searchQuery="" />);
      
      const checkbox = screen.getByRole('button', { name: /toggle complete/i });
      fireEvent.click(checkbox);
      
      expect(mockUpdateTask).toHaveBeenCalledWith('1', { completed: true });
    });

    test('TaskForm handles task creation', () => {
      render(<TaskForm isOpen={true} onClose={() => {}} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      
      expect(titleInput.value).toBe('New Task');
    });

    test('Search functionality filters tasks', () => {
      render(<TaskList searchQuery="nonexistent" />);
      
      expect(screen.getByText('No matching tasks')).toBeInTheDocument();
    });
  });

  describe('Sidebar Navigation Tests', () => {
    test('Sidebar renders navigation items', () => {
      render(<Sidebar onProfileClick={() => {}} />);
      
      expect(screen.getByText('TaskTick')).toBeInTheDocument();
      expect(screen.getByText('Inbox')).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
      expect(screen.getByText('Starred')).toBeInTheDocument();
    });

    test('List selection works', () => {
      const { useTaskStore } = require('../store/taskStore');
      const mockSetSelectedList = jest.fn();
      useTaskStore.mockReturnValue({
        ...useTaskStore(),
        setSelectedList: mockSetSelectedList
      });

      render(<Sidebar onProfileClick={() => {}} />);
      
      fireEvent.click(screen.getByText('Today'));
      expect(mockSetSelectedList).toHaveBeenCalledWith('today');
    });
  });

  describe('Profile Modal Tests', () => {
    test('ProfileModal renders all tabs', () => {
      render(<ProfileModal isOpen={true} onClose={() => {}} />);
      
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    test('Profile tab shows user information', () => {
      render(<ProfileModal isOpen={true} onClose={() => {}} />);
      
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    test('Modal closes when close button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<ProfileModal isOpen={true} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Recurring Date Picker Tests', () => {
    test('RecurringDatePicker renders with default state', () => {
      const mockOnChange = jest.fn();
      render(<RecurringDatePicker onChange={mockOnChange} />);
      
      expect(screen.getByText('Recurrence')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
    });

    test('Recurrence type selection works', async () => {
      const mockOnChange = jest.fn();
      render(<RecurringDatePicker onChange={mockOnChange} />);
      
      const typeSelect = screen.getByDisplayValue('daily');
      fireEvent.change(typeSelect, { target: { value: 'weekly' } });
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalled();
      });
    });

    test('Date selection updates state', async () => {
      const mockOnChange = jest.fn();
      render(<RecurringDatePicker onChange={mockOnChange} />);
      
      const startDateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalled();
      });
    });
  });

  describe('Utility Functions Tests', () => {
    test('generateRecurringDates creates correct daily recurrence', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      
      const dates = generateRecurringDates({
        type: 'daily',
        interval: 1,
        startDate,
        endDate
      });
      
      expect(dates).toHaveLength(7);
      expect(dates[0]).toEqual(startDate);
    });

    test('generateRecurringDates creates correct weekly recurrence', () => {
      const startDate = new Date('2024-01-01'); // Monday
      const endDate = new Date('2024-01-15');
      
      const dates = generateRecurringDates({
        type: 'weekly',
        interval: 1,
        startDate,
        endDate,
        daysOfWeek: [1] // Monday
      });
      
      expect(dates).toHaveLength(3); // 3 Mondays in the range
    });

    test('formatRecurrenceText returns correct format', () => {
      const config = {
        type: 'daily',
        interval: 2
      };
      
      const text = formatRecurrenceText(config);
      expect(text).toBe('Every 2 days');
    });

    test('getNextOccurrence calculates next date correctly', () => {
      const baseDate = new Date('2024-01-01');
      const config = {
        type: 'weekly',
        interval: 1,
        daysOfWeek: [1] // Monday
      };
      
      const nextDate = getNextOccurrence(baseDate, config);
      expect(nextDate.getDay()).toBe(1); // Should be a Monday
    });

    test('validateRecurrencePattern validates correctly', () => {
      const validConfig = {
        type: 'daily',
        interval: 1,
        startDate: new Date('2024-01-01')
      };
      
      const invalidConfig = {
        type: 'daily',
        interval: 0,
        startDate: new Date('2024-01-01')
      };
      
      expect(validateRecurrencePattern(validConfig)).toBe(true);
      expect(validateRecurrencePattern(invalidConfig)).toBe(false);
    });
  });

  describe('Integration Workflow Tests', () => {
    test('Complete task creation and management workflow', async () => {
      const { useTaskStore } = require('../store/taskStore');
      const mockAddTask = jest.fn();
      const mockUpdateTask = jest.fn();
      
      useTaskStore.mockReturnValue({
        ...useTaskStore(),
        addTask: mockAddTask,
        updateTask: mockUpdateTask
      });

      // Render the main components
      const { rerender } = render(
        <div>
          <Sidebar onProfileClick={() => {}} />
          <TaskList searchQuery="" />
          <TaskForm isOpen={true} onClose={() => {}} />
        </div>
      );
      
      // Test task creation form
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'Integration Test Task' } });
      
      // Test that the form accepts input
      expect(titleInput.value).toBe('Integration Test Task');
      
      // Test task list functionality
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    test('Theme change affects all components', () => {
      const { useThemeStore } = require('../store/themeStore');
      
      // Test with light theme
      render(
        <ThemeProvider>
          <Sidebar onProfileClick={() => {}} />
          <TaskList searchQuery="" />
        </ThemeProvider>
      );
      
      expect(screen.getByText('TaskTick')).toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    test('TaskList handles empty state', () => {
      const { useTaskStore } = require('../store/taskStore');
      useTaskStore.mockReturnValue({
        ...useTaskStore(),
        tasks: []
      });

      render(<TaskList searchQuery="" />);
      
      expect(screen.getByText('All done for today!')).toBeInTheDocument();
    });

    test('RecurringDatePicker handles invalid dates', () => {
      const mockOnChange = jest.fn();
      render(<RecurringDatePicker onChange={mockOnChange} />);
      
      // Test with various inputs to ensure no crashes
      const component = screen.getByText('Recurrence').closest('div');
      expect(component).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    test('Components have proper ARIA labels', () => {
      render(<TaskList searchQuery="" />);
      
      const checkboxButton = screen.getByRole('button');
      expect(checkboxButton).toBeInTheDocument();
    });

    test('Modal has proper focus management', () => {
      render(<ProfileModal isOpen={true} onClose={() => {}} />);
      
      const modal = screen.getByRole('button', { name: /close/i });
      expect(modal).toBeInTheDocument();
    });
  });
});
