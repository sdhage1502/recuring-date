
'use client';

import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { 
  Plus, 
  Calendar, 
  Star, 
  Clock, 
  Coffee,
  Target,
  Lightbulb,
  Rocket
} from 'lucide-react';

export default function QuickActions() {
  const { addTask } = useTaskStore();
  const [showMore, setShowMore] = useState(false);

  const quickTasks = [
    { title: 'Review emails', icon: Clock, priority: 'medium', category: 'work' },
    { title: 'Take a break', icon: Coffee, priority: 'low', category: 'personal' },
    { title: 'Plan tomorrow', icon: Calendar, priority: 'medium', category: 'planning' },
    { title: 'Brainstorm ideas', icon: Lightbulb, priority: 'low', category: 'creative' },
    { title: 'Weekly review', icon: Target, priority: 'high', category: 'planning' },
    { title: 'Start new project', icon: Rocket, priority: 'high', category: 'work' }
  ];

  const handleQuickAdd = (quickTask) => {
    const newTask = {
      title: quickTask.title,
      priority: quickTask.priority,
      completed: false,
      starred: false,
      listId: 'inbox',
      createdAt: new Date().toISOString(),
      tags: [quickTask.category]
    };
    addTask(newTask);
  };

  const visibleTasks = showMore ? quickTasks : quickTasks.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {visibleTasks.map((quickTask, index) => {
          const Icon = quickTask.icon;
          return (
            <button
              key={quickTask.title}
              onClick={() => handleQuickAdd(quickTask)}
              className="floating-card glass p-4 rounded-lg text-left hover:scale-105 transition-all duration-200 group animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {quickTask.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      quickTask.priority === 'high' ? 'bg-red-400' :
                      quickTask.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {quickTask.category}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
