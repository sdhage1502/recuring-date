
import { create } from 'zustand';

export const useTaskStore = create((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Review project proposal',
      description: 'Go through the new client proposal and provide feedback',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'high',
      starred: true,
      completed: false,
      listId: 'inbox',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, and fruits',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      starred: false,
      completed: false,
      listId: 'inbox',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Call dentist',
      description: 'Schedule annual checkup appointment',
      dueDate: '',
      priority: 'low',
      starred: false,
      completed: true,
      listId: 'inbox',
      createdAt: new Date().toISOString()
    }
  ],
  lists: [
    { id: 'inbox', name: 'Inbox', color: '#3b82f6', isDefault: true },
    { id: 'today', name: 'Today', color: '#ef4444', isDefault: true },
    { id: 'upcoming', name: 'Upcoming', color: '#f59e0b', isDefault: true },
  ],
  selectedList: 'inbox',
  filter: 'all',
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Date.now().toString() }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  addList: (list) => set((state) => ({
    lists: [...state.lists, { ...list, id: Date.now().toString() }]
  })),
  
  setSelectedList: (listId) => set({ selectedList: listId }),
  setFilter: (filter) => set({ filter }),
  
  getFilteredTasks: () => {
    const { tasks, selectedList, filter } = get();
    let filtered = tasks;
    
    if (selectedList !== 'all') {
      filtered = filtered.filter(task => task.listId === selectedList);
    }
    
    switch (filter) {
      case 'completed':
        return filtered.filter(task => task.completed);
      case 'pending':
        return filtered.filter(task => !task.completed);
      case 'today':
        const today = new Date().toDateString();
        return filtered.filter(task =>
          task.dueDate && new Date(task.dueDate).toDateString() === today
        );
      default:
        return filtered;
    }
  },
}));
