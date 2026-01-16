import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, Typography, DatePicker, Select, Button } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  MessageOutlined, 
  DollarOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { dashboard } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './DashboardPage.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      } else {
        params.timeRange = timeRange;
      }

      const [statsRes, leadsRes] = await Promise.all([
        dashboard.getStats(params),
        dashboard.getRecentLeads(5)
      ]);

      setStats(statsRes.data);
      setRecentLeads(leadsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      setTimeRange('custom');
    }
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    if (value !== 'custom') {
      setDateRange([]);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/admin/leads/${record.id}`)}>
          {text || 'N/A'}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (text) => text || 'Website',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (text) => formatDate(text, 'MMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge status-${status?.toLowerCase() || 'new'}`}>
          {status || 'New'}
        </span>
      ),
    },
  ];

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <Card className="stat-card" hoverable>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color }}
      />
      {trend && (
        <div className="trend">
          {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span className={`trend-${trend}`}>{trendValue}% from last period</span>
        </div>
      )}
    </Card>
  );

  if (loading && !stats) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <Title level={2} className="page-title">Dashboard</Title>
        <div className="dashboard-controls">
          <Select 
            value={timeRange} 
            onChange={handleTimeRangeChange}
            style={{ width: 150, marginRight: 8 }}
          >
            <Option value="today">Today</Option>
            <Option value="yesterday">Yesterday</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
            <Option value="custom">Custom Range</Option>
          </Select>
          <RangePicker 
            value={dateRange}
            onChange={handleDateRangeChange}
            disabled={timeRange !== 'custom'}
            style={{ marginRight: 8 }}
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchDashboardData}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads || 0}
            icon={<UserOutlined />}
            color="#1890ff"
            trend="up"
            trendValue={stats?.leadsGrowth || 0}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="New Leads"
            value={stats?.newLeads || 0}
            icon={<UserAddOutlined />}
            color="#52c41a"
            trend={stats?.newLeadsTrend || 'up'}
            trendValue={stats?.newLeadsGrowth || 0}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Blog Posts"
            value={stats?.totalPosts || 0}
            icon={<FileTextOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Messages"
            value={stats?.totalMessages || 0}
            icon={<MessageOutlined />}
            color="#fa8c16"
            trend={stats?.messagesTrend || 'up'}
            trendValue={stats?.messagesGrowth || 0}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-content">
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Leads" 
            className="recent-leads-card"
            extra={
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={() => navigate('/admin/leads/export')}
              >
                Export
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={recentLeads}
              rowKey="id"
              pagination={false}
              loading={loading}
              size="small"
              onRow={(record) => ({
                onClick: () => navigate(`/admin/leads/${record.id}`),
                style: { cursor: 'pointer' },
              })}
            />
            <div className="view-all-container">
              <Button type="link" onClick={() => navigate('/admin/leads')}>
                View All Leads
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Lead Sources" className="lead-sources-card">
            {stats?.leadSources?.map((source) => (
              <div key={source.name} className="source-item">
                <div className="source-info">
                  <Text strong>{source.name}</Text>
                  <Text type="secondary">{source.count} leads</Text>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <Text className="percentage">{source.percentage}%</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
