import { RouterProvider, useLocation, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { router } from './routes';
import Maintenance from '../components/Maintenance';
import { api } from '../services/api';

// Layout component that handles maintenance logic
export default function MaintenanceLayout() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const response = await api.get('/public/system-settings');
      setMaintenanceMode(response.data?.maintenanceMode || false);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      // Default to false if API fails
      setMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Show loading spinner while checking maintenance mode
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If maintenance mode is ON and NOT on admin route, show maintenance page
  if (maintenanceMode && !isAdminRoute) {
    return (
      <HelmetProvider>
        <Maintenance />
        <Toaster position="top-right" />
      </HelmetProvider>
    );
  }

  // Otherwise, render the child routes
  return (
    <HelmetProvider>
      <Outlet />
      <Toaster position="top-right" />
    </HelmetProvider>
  );
}
