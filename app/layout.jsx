
import './globals.css'
import AuthProvider from '../contexts/AuthProvider'
import ThemeProvider from '../components/ThemeProvider'

export const metadata = {
  title: 'Task Manager',
  description: 'A simple task management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
