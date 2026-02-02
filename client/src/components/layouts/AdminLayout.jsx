import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings, 
  Menu, 
  X,
  FileTextIcon,
  Home,
  Info,
  Phone,
  UserCheck,
  Shield,
  AlertCircle,
  MonitorPlay, // RealWork Studio icon
  // 👇 New Icons Import kiye hain
  GraduationCap, // Programs ke liye
  Wrench,        // Services ke liye
  Package,       // Products ke liye
  Layers,        // Business Group ke liye
  Power          // System Settings ke liye
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, current: location.pathname === '/admin/dashboard' },
    { name: 'Leads Management', href: '/admin/leads', icon: Users, current: location.pathname === '/admin/leads' },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText, current: location.pathname === '/admin/blog' },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase, current: location.pathname === '/admin/careers' },
    
    // 👇 NAYA SECTION ADD KIYA HAI: Business Modules
    { 
      name: 'Business Modules', 
      icon: Layers,
      current: location.pathname.startsWith('/admin/programs') || location.pathname.startsWith('/admin/services') || location.pathname.startsWith('/admin/products'),
      children: [
        { name: 'Programs', href: '/admin/programs', icon: GraduationCap }, // RealWorkStudio
        { name: 'Services', href: '/admin/services', icon: Wrench },        // TechWorkStudio
        { name: 'Products', href: '/admin/products', icon: Package },       // Products & AI
      ]
    },

    { 
      name: 'Page Content', 
      icon: FileTextIcon,
      current: location.pathname.startsWith('/admin/page-content'),
      children: [
        { name: 'Home', href: '/admin/page-content/home', icon: Home },
        { name: 'About', href: '/admin/page-content/about', icon: Info },
        { name: 'Blog', href: '/admin/page-content/blog', icon: FileText },
        { name: 'Contact', href: '/admin/page-content/contact', icon: Phone },
        { name: 'RealWork Studio', href: '/admin/page-content/realworkstudio', icon: MonitorPlay },
        { name: 'TechWork Studio', href: '/admin/page-content/techworksstudio', icon: Wrench },
        { name: 'Products', href: '/admin/page-content/products', icon: Package },
        { name: 'Careers', href: '/admin/page-content/careers', icon: UserCheck },
        { name: 'Legal', href: '/admin/page-content/legal', icon: Shield },
        { name: 'System', href: '/admin/page-content/system', icon: AlertCircle },
      ]
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      current: location.pathname.startsWith('/admin/settings') || location.pathname === '/admin/seo-settings' || location.pathname === '/admin/system',
      children: [
        { name: 'General', href: '/admin/settings', icon: Settings },
        { name: 'SEO Settings', href: '/admin/seo-settings', icon: FileText },
        { name: 'System Settings', href: '/admin/system', icon: Power },
      ]
    },
  ];

  // Function to render nav items (Same logic as before)
  const renderNavItems = (isMobile) => {
    return navigation.map((item) => (
      <div key={item.name}>
        {item.children ? (
          // Agar Sub-menu hai (Jaise Page Content ya Business Modules)
          <div className="space-y-1 mt-2 mb-2">
            <div className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {item.name}
            </div>
            {item.children.map((child) => (
              <Link
                key={child.name}
                to={child.href}
                onClick={() => isMobile && setSidebarOpen(false)} 
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === child.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <child.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    location.pathname === child.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {child.name}
              </Link>
            ))}
          </div>
        ) : (
          // Agar simple link hai
          <Link
            to={item.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              item.current
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 flex-shrink-0 h-6 w-6 ${
                item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 🟢 Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white h-full">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
                <span className="sr-only">Close sidebar</span>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">JASIQ Labs</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {renderNavItems(true)}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button onClick={handleLogout} className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div><LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" /></div>
                  <div className="ml-3"><p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Sign out</p></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white min-h-screen">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">JASIQ Labs</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1 bg-white">
              {renderNavItems(false)}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button onClick={handleLogout} className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div><LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" /></div>
                <div className="ml-3"><p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Sign out</p></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="block h-6 w-6" aria-hidden="true" />
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Page Content Outlet */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;