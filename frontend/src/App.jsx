import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './app/routes.jsx';
import AuthProvider from './store/AuthProvider.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4">
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
