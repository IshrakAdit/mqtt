import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const { user, isAuthenticated } = useUser();
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register'

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  // Show dashboard if user is logged in
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Show register page
  if (currentView === 'register') {
    return (
      <Register 
        onSwitchToLogin={switchToLogin} 
      />
    );
  }

  // Show login page (default)
  return (
    <Login 
      onSwitchToRegister={switchToRegister} 
    />
  );
};

export default Index;