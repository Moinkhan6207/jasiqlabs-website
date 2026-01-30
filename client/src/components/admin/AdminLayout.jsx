import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Dropdown, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BookOutlined,
  ShopOutlined,
  ToolOutlined,
  GlobalOutlined,
  SettingOutlined, // ✅ FIX 1: Missing Import Added
} from '@ant-design/icons';
// ✅ FIX 2: Correct Path (contexts instead of context)
import { useAuth } from '../../contexts/AuthContext';
// import Logo from '../common/Logo'; // Agar logo file nahi hai to comment rakhein
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login'); // Redirect to Admin Login
  };

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: '/admin/blog',
      icon: <FileTextOutlined />,
      label: 'Blog Posts',
      onClick: () => navigate('/admin/blog'),
    },
    {
      key: '/admin/careers',
      icon: <TeamOutlined />,
      label: 'Careers',
      onClick: () => navigate('/admin/careers'),
    },
    {
      key: 'content',
      icon: <GlobalOutlined />,
      label: 'Page Content',
      children: [
        {
          key: '/admin/content/home',
          label: 'Home',
          onClick: () => navigate('/admin/content/home'),
        },
        {
          key: '/admin/content/about',
          label: 'About',
          onClick: () => navigate('/admin/content/about'),
        },
        {
          key: '/admin/content/contact',
          label: 'Contact',
          onClick: () => navigate('/admin/content/contact'),
        },
      ],
    },
    {
      key: 'business',
      icon: <ShopOutlined />,
      label: 'Business Modules',
      children: [
        {
          key: '/admin/programs',
          icon: <BookOutlined />,
          label: 'Programs',
          onClick: () => navigate('/admin/programs'),
        },
        {
          key: '/admin/services',
          icon: <ToolOutlined />,
          label: 'Services',
          onClick: () => navigate('/admin/services'),
        },
        {
          key: '/admin/products',
          icon: <ShopOutlined />,
          label: 'Products',
          onClick: () => navigate('/admin/products'),
        },
      ],
    },
    {
      key: '/admin/leads',
      icon: <TeamOutlined />,
      label: 'Leads',
      onClick: () => navigate('/admin/leads'),
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        danger
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100, // Ensure sidebar stays on top
        }}
      >
        <div className="logo" style={{
          height: '64px',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '6px'
        }}>
          {collapsed ? 'JL' : 'JASIQ LABS'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]} // Highlight current page
          items={menuItems} // ✅ FIX 3: Changed 'items' to 'menuItems'
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                marginLeft: -24,
              }}
            />
            <Title level={4} style={{ margin: 0, marginLeft: 16 }}>Admin Dashboard</Title>
          </div>
          <div>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                />
                {!collapsed && (
                  <span style={{ fontWeight: 500 }}>{user?.email || 'Admin'}</span>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'transparent', // Let Dashboard handle background
            overflow: 'initial'
          }}
        >
          {/* Outlet hi wo jagah hai jahan Dashboard dikhega */}
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;