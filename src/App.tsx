import { AuthProviderContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { AuthPage } from './components/AuthPage'
import { ToastNotification } from './components/ToastNotification'
import './index.css'

function App() {
  return (
    <AuthProviderContext>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-[Inter,system-ui,sans-serif]">
        <Navbar />
        <AuthPage />
        <ToastNotification />
      </div>
    </AuthProviderContext>
  )
}

export default App
