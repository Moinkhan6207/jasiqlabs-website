import { useState, useEffect } from 'react';
import { Users, GraduationCap, Building2, Handshake, RefreshCw, ChevronDown } from 'lucide-react'; // 🟢 Naye Icons add kiye
import { toast } from 'react-hot-toast';
import Seo from '../../components/seo/Seo';
import api from '../../services/api';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🟢 Requirement ke hisaab se Stats State badal diya
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    clients: 0,
    partners: 0,
  });

  // Allowed Status Options (Ye waisa hi hai)
  const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Converted', 'Rejected'];

  // 1. Fetch Data
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.leads.getAll();
      const leadsData = response.data?.data?.leads || response.data?.leads || [];
      
      setLeads(leadsData);
      calculateStats(leadsData);
      
    } catch (error) {
      console.error('Error fetching leads:', error);
      if (error.response?.status !== 401) {
        toast.error('Server connection failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Stats Calculation Logic (🟢 UPDATED FOR REQUIREMENT)
  const calculateStats = (data) => {
    const calculatedStats = {
      total: data.length,
      // Interest Type ke hisaab se ginti (Case-insensitive check)
      students: data.filter(lead => lead.interestType?.toUpperCase() === 'STUDENT').length,
      clients: data.filter(lead => lead.interestType?.toUpperCase() === 'CLIENT').length,
      partners: data.filter(lead => lead.interestType?.toUpperCase() === 'PARTNER').length,
    };
    setStats(calculatedStats);
  };

  // 3. Handle Status Change (Ye waisa hi hai)
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.leads.updateStatus(leadId, newStatus);
      toast.success(`Status updated to ${newStatus}`);

      const updatedLeads = leads.map((lead) => 
        (lead._id === leadId || lead.id === leadId) ? { ...lead, status: newStatus } : lead
      );

      setLeads(updatedLeads);
      // Stats calculate karne ki zaroorat nahi kyunki type change nahi hua
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Status Colors Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Qualified': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Converted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Seo title="Dashboard | JASIQ Labs" noIndex={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={fetchLeads}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* 🟢 Stats Grid (UPDATED: 4 Cards as per Requirement) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          
          {/* Card 1: Total Leads */}
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Total Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          {/* Card 2: Student Leads */}
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.students}</p>
              </div>
            </div>
          </div>

          {/* Card 3: Client Leads */}
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.clients}</p>
              </div>
            </div>
          </div>

          {/* Card 4: Partner Leads */}
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Handshake className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Partners</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.partners}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Leads Table (Ye Same Rahega) */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Leads</h3>
          </div>
          <div className="overflow-x-auto" style={{ minHeight: '300px' }}> 
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Action)</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center"><div className="flex justify-center items-center flex-col"><RefreshCw className="animate-spin h-8 w-8 text-blue-500 mb-2"/><span className="text-gray-500 text-sm">Fetching leads...</span></div></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No leads found.</td></tr>
                ) : (
                  leads.slice(0, 10).map((lead) => (
                    <tr key={lead._id || lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      
                      {/* 🟢 Showing Interest Type */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {lead.interestType || 'General'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block text-left">
                          <select
                            value={lead.status || 'New'}
                            onChange={(e) => handleStatusChange(lead._id || lead.id, e.target.value)}
                            className={`block w-full pl-3 pr-8 py-1 text-xs font-semibold rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border ${getStatusColor(lead.status || 'New')}`}
                            style={{ minWidth: '110px' }}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option} value={option} className="bg-white text-gray-900">
                                {option}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                            <ChevronDown className="h-3 w-3" />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody></table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;