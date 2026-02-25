import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/Router'
import { AuthProvider } from './context/Context'
import { useEffect } from 'react'

// استيراد دالة رفع البيانات
import { uploadServices } from './addData'

function App() {

  useEffect(() => {
    uploadServices(); // سيتم رفع الداتا عند تشغيل المشروع
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App