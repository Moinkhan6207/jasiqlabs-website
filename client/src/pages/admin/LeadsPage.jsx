import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Search, Filter, Mail, Phone, Calendar, Globe } from 'lucide-react';
import api from '../../services/api';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterInterest, setFilterInterest] = useState('All Interests');
  const [filterDivision, setFilterDivision] = useState('All Divisions');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.leads.getAll();
        const data = response.data?.data?.leads || [];
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // 2. Handle Filters
  useEffect(() => {
    const filteredLeads = leads.filter(lead => {
      // 1. Search Logic - Check BOTH Name AND Email (case-insensitive, robust)
      const searchLower = searchQuery.toLowerCase().trim();
      const isSearchMatch = !searchLower || 
        (lead.name || '').toLowerCase().includes(searchLower) || 
        (lead.email || '').toLowerCase().includes(searchLower);

      // 2. Interest Filter - Map frontend values to backend enum values
      const interestMap = {
        'Student': 'STUDENT',
        'Client': 'CLIENT', 
        'Partner': 'PARTNER'
      };
      const backendInterestValue = interestMap[filterInterest];
      const interestMatch = filterInterest === 'All Interests' || 
        lead.interestType === backendInterestValue;

      // 3. Division Filter - Map frontend values to backend enum values
      const divisionMap = {
        'RealWorkStudio': 'RWS',
        'TechWorksStudio': 'TWS',
        'Products & AI': 'PRODUCTS'
      };
      const backendDivisionValue = divisionMap[filterDivision];
      const divisionMatch = filterDivision === 'All Divisions' || 
        lead.division === backendDivisionValue;

      return isSearchMatch && interestMatch && divisionMatch;
    });

    setFilteredLeads(filteredLeads);
  }, [filterInterest, filterDivision, searchQuery, leads]);

  // 3. Handle Status Change
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.leads.updateStatus(leadId, newStatus);
      
      // Update local state
      const updatedLeads = leads.map((lead) => 
        (lead._id === leadId || lead.id === leadId) ? { ...lead, status: newStatus } : lead
      );
      setLeads(updatedLeads);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // 4. Export to CSV Logic
  const exportToCSV = () => {
    // CSV Headers
    const headers = ["Name,Email,Phone,Interest Type,Division,Source,Message,Status,Created Date"];
    
    // Convert Data to CSV Row
    const rows = filteredLeads.map(lead => 
      `"${lead.name || ''}","${lead.email || ''}","${lead.phone || ''}","${lead.interestType || ''}","${lead.division || ''}","${lead.source || lead.sourcePage || 'Web Form'}","${(lead.message || '').replace(/"/g, '""')}","${lead.status || 'New'}","${new Date(lead.createdAt).toLocaleString()}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jasiq_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status options - Map to backend enum values
  const STATUS_OPTIONS = ['NEW', 'REVIEWED', 'CONTACTED', 'CONVERTED', 'REJECTED'];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REVIEWED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONTACTED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CONVERTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Leads Dashboard | JasiqLabs Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-500 text-sm">View and manage incoming queries</p>
        </div>
        
        <button 
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter size={18} /> <span className="font-medium text-sm">Filters:</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Interest Filter */}
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filterInterest}
            onChange={(e) => setFilterInterest(e.target.value)}
          >
            <option value="All Interests">All Interests</option>
            <option value="Student">Student (Internship)</option>
            <option value="Client">Client (Project)</option>
            <option value="Partner">Partner</option>
          </select>

          {/* Division Filter */}
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
          >
            <option value="All Divisions">All Divisions</option>
            <option value="RealWorkStudio">RealWorkStudio</option>
            <option value="TechWorksStudio">TechWorksStudio</option>
            <option value="Products & AI">Products & AI</option>
          </select>
          
          <div className="text-sm text-gray-500">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Interest Type</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Division</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Message</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">
                  {searchQuery || filterInterest !== 'All Interests' || filterDivision !== 'All Divisions' 
                    ? 'No leads found matching your filters.' 
                    : 'No leads found.'}
                </td></tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <div>
                          <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                        <span className="flex items-center gap-1"><Mail size={10} /> {lead.email}</span>
                        <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium 
                        ${lead.interestType === 'CLIENT' ? 'bg-purple-100 text-purple-700' : 
                          lead.interestType === 'STUDENT' ? 'bg-blue-100 text-blue-700' : 
                          lead.interestType === 'PARTNER' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'}`}>
                        {lead.interestType === 'CLIENT' ? 'Client' : 
                         lead.interestType === 'STUDENT' ? 'Student' : 
                         lead.interestType === 'PARTNER' ? 'Partner' :
                         'General'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {lead.division === 'RWS' ? 'RealWorkStudio' : 
                       lead.division === 'TWS' ? 'TechWorksStudio' : 
                       lead.division === 'PRODUCTS' ? 'Products & AI' :
                       'General'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Globe size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.source || 'Contact Form'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={lead.message}>
                        {lead.message || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status || 'NEW'}
                        onChange={(e) => handleStatusChange(lead._id || lead.id, e.target.value)}
                        className={`block w-full pl-3 pr-8 py-1 text-xs font-semibold rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border ${getStatusColor(lead.status || 'NEW')}`}
                        style={{ minWidth: '100px' }}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option} className="bg-white text-gray-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LeadsPage;