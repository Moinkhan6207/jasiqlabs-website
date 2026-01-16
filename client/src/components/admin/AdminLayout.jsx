import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Dropdown, Button, Typography, Badge, Divider } from 'antd';
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
  BellOutlined,
  MessageOutlined,
  LineChartOutlined,
  FileExcelOutlined,
  UserAddOutlined,
  FormOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  BarChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <FileTextOutlined />,
      label: 'Blog Posts',
      onClick: () => navigate('/admin/blog'),
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: 'Careers',
      onClick: () => navigate('/admin/careers'),
    },
    {
      key: '4',
      icon: <GlobalOutlined />,
      label: 'Page Content',
      children: [
        {
          key: '4-1',
          label: 'Home',
          onClick: () => navigate('/admin/content/home'),
        },
        {
          key: '4-2',
          label: 'About',
          onClick: () => navigate('/admin/content/about'),
        },
        {
          key: '4-3',
          label: 'Contact',
          onClick: () => navigate('/admin/content/contact'),
        },
      ],
    },
    {
      key: '5',
      icon: <BookOutlined />,
      label: 'Programs',
      onClick: () => navigate('/admin/divisions/program'),
    },
    {
      key: '6',
      icon: <ToolOutlined />,
      label: 'Services',
      onClick: () => navigate('/admin/divisions/service'),
    },
    {
      key: '7',
      icon: <ShopOutlined />,
      label: 'Products',
      onClick: () => navigate('/admin/divisions/product'),
    },
    {
      key: '8',
      icon: <TeamOutlined />,
      label: 'Leads',
      onClick: () => navigate('/admin/leads'),
    },
    {
      key: '9',
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
        }}>
          {collapsed ? 'JL' : 'JASIQ LABS'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
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
          zIndex: 1,
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
                  <span>{user?.name || 'Admin'}</span>
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
            background: colorBgContainer,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
