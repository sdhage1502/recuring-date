
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import Sidebar from '../../components/Sidebar';
import ProfileModal from '../../components/ProfileModal';
import TaskList from '../../components/TaskList';
import TaskForm from '../../components/TaskForm';
import TaskStats from '../../components/TaskStats';
import QuickActions from '../../components/QuickActions';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Bell, 
  BarChart3, 
  Settings,
  Sun,
  Moon,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // list, kanban, calendar
  
  const { user, isLoading } = useAuthStore();
  const { selectedList, lists, tasks } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentList = lists.find(list => list.id === selectedList) || lists[0];
  const completedToday = tasks.filter(task => 
    task.completed && 
    new Date(task.updatedAt || task.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <Sidebar onProfileClick={() => setIsProfileOpen(true)} />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Enhanced Header */}
          <header className="glass sticky top-0 z-30 border-b border-white/20 dark:border-gray-700/50">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:block">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {currentList?.name || 'Inbox'}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {completedToday > 0 ? `${completedToday} tasks completed today 🎉` : 'Let\'s get productive!'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Enhanced Search */}
                  <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-64' : 'w-48'}`}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring transition-all duration-200"
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex bg-white/80 dark:bg-gray-800/80 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className={`p-2 rounded-md transition-colors ${
                        showStats 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <button
                    onClick={() => setIsTaskFormOpen(true)}
                    className="floating-card bg-gradient-primary text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Panel */}
          {showStats && (
            <div className="p-4 sm:p-6 animate-slide-up">
              <TaskStats />
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="p-4 sm:p-6 pb-2">
            <QuickActions />
          </div>

          {/* Main Content Area */}
          <main className="flex-1">
            <TaskList searchQuery={searchQuery} viewMode={viewMode} />
          </main>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
      
      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
      />
    </div>
  );
}
