
'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to TaskTick
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Stay Organized, Stay Creative - Your powerful task management companion
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/auth" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </a>
            <a 
              href="/dashboard" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-blue-600 text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">Organize your tasks efficiently with our intuitive interface</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-green-600 text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Custom Themes</h3>
            <p className="text-gray-600">Personalize your workspace with beautiful themes</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-purple-600 text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
            <p className="text-gray-600">Access your tasks anywhere, on any device</p>
          </div>
        </div>
      </div>
    </div>
  );
}
