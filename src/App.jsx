import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/Router'
import { AuthProvider } from './context/Context'

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
