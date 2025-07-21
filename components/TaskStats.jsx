
'use client';

import { useTaskStore } from '../store/taskStore';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Target, 
  Calendar,
  Zap
} from 'lucide-react';

export default function TaskStats() {
  const { tasks } = useTaskStore();

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length,
    completedToday: tasks.filter(task => 
      task.completed && 
      new Date(task.updatedAt || task.createdAt).toDateString() === new Date().toDateString()
    ).length,
    completedThisWeek: tasks.filter(task => {
      const taskDate = new Date(task.updatedAt || task.createdAt);
      return task.completed && taskDate >= startOfWeek && taskDate <= endOfWeek;
    }).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const productivity = stats.completedToday >= 3 ? 'High' : stats.completedToday >= 1 ? 'Medium' : 'Low';

  const statCards = [
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+12% from yesterday'
    },
    {
      title: 'Pending Tasks',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      change: 'Due this week'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: 'Overall progress'
    },
    {
      title: 'Productivity',
      value: productivity,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: 'Today\'s performance'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="floating-card glass p-6 rounded-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Visualization */}
      <div className="floating-card glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Progress
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>{stats.completedThisWeek} tasks completed</span>
          </div>
        </div>
        
        <div className="progress-bar h-3 mb-3">
          <div 
            className="progress-fill h-full rounded-full"
            style={{ width: `${Math.min(completionRate, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>0%</span>
          <span className="font-medium">{completionRate}% Complete</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
