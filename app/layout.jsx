
import './globals.css';
import AuthProvider from '../contexts/AuthProvider';
import ThemeProvider from '../components/ThemeProvider';

export const metadata = {
  title: 'TaskTick - Stay Organized, Stay Creative',
  description: 'A powerful task management app to organize your life',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
