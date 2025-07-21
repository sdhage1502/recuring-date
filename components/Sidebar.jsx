
'use client';

import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { 
  Inbox, 
  Calendar, 
  Clock, 
  Star, 
  Plus, 
  Settings, 
  List,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ onProfileClick }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
  const { lists, selectedList, setSelectedList } = useTaskStore();
  const { getCurrentTheme } = useThemeStore();
  const theme = getCurrentTheme();

  const defaultLists = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 5 },
    { id: 'today', name: 'Today', icon: Calendar, count: 3 },
    { id: 'upcoming', name: 'Upcoming', icon: Clock, count: 8 },
    { id: 'starred', name: 'Starred', icon: Star, count: 2 },
  ];

  const handleListSelect = (listId) => {
    setSelectedList(listId);
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg touch-manipulation"
      >
        {isCollapsed ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 
        transform ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        transition-all duration-300 ease-in-out
        glass backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50
        ${!isCollapsed ? 'lg:w-64' : 'lg:w-16'}
        shadow-xl lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold shadow-lg">
                T
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    TaskTick
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Stay productive</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {defaultLists.map((list) => {
                const Icon = list.icon;
                const isSelected = selectedList === list.id;
                
                return (
                  <button
                    key={list.id}
                    onClick={() => handleListSelect(list.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors touch-manipulation
                      ${isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{list.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {list.count}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Lists */}
            {!isCollapsed && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Lists
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {lists.filter(list => !list.isDefault).map((list) => (
                    <button
                      key={list.id}
                      onClick={() => handleListSelect(list.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors touch-manipulation
                        ${selectedList === list.id 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: list.color }}
                      />
                      <span className="flex-1">{list.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onProfileClick}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
