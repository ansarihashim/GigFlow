import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import AppRoutes from './app/routes.jsx';
import AuthProvider from './store/AuthProvider.jsx';
import { connectSocket, onHired, disconnectSocket } from './socket/socket.js';

function App() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    connectSocket();

    // Subscribe to events using abstraction
    const cleanupListener = onHired((data) => {
      console.log('Notification received:', data);
      setToast({
        title: data.gigTitle || 'Gig Update',
        message: data.message || 'You have been hired!'
      });
    });

    return () => {
      if (cleanupListener) cleanupListener();
      disconnectSocket();
    };
  }, []);

  const closeToast = () => setToast(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4">
            <AppRoutes />
          </main>

          {toast && (
            <Toast
              message={toast.message}
              title={toast.title}
              onClose={closeToast}
            />
          )}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
