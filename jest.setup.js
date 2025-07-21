
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
import '@testing-library/jest-dom';

// Mock Zustand stores
jest.mock('./store/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
  }),
}));

jest.mock('./store/taskStore', () => ({
  useTaskStore: () => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        priority: 'High',
        completed: false,
        dueDate: new Date('2024-12-31'),
      },
    ],
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  }),
}));

jest.mock('./store/themeStore', () => ({
  useThemeStore: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock Firebase
jest.mock('./lib/firebase', () => ({
  auth: {},
  db: {},
}));
