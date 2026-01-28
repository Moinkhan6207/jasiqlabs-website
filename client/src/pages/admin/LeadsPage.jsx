import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../services/api';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterInterest, setFilterInterest] = useState('All');
  const [filterDivision, setFilterDivision] = useState('All');

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
    let result = leads;

    if (filterInterest !== 'All') {
      result = result.filter(lead => lead.interest === filterInterest);
    }
    if (filterDivision !== 'All') {
      result = result.filter(lead => lead.division === filterDivision);
    }

    setFilteredLeads(result);
  }, [filterInterest, filterDivision, leads]);

  // 3. Export to CSV Logic
  const exportToCSV = () => {
    // CSV Headers
    const headers = ["Name,Email,Phone,Interest,Division,Message,Date"];
    
    // Convert Data to CSV Row
    const rows = filteredLeads.map(lead => 
      `"${lead.name}","${lead.email}","${lead.phone}","${lead.interest}","${lead.division || '-'}","${(lead.message || '').replace(/"/g, '""')}","${new Date(lead.createdAt).toLocaleDateString()}"`
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
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={18} /> <span className="font-medium text-sm">Filters:</span>
        </div>

        {/* Interest Filter */}
        <select 
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={filterInterest}
          onChange={(e) => setFilterInterest(e.target.value)}
        >
          <option value="All">All Interests</option>
          <option value="Student">Student (Internship)</option>
          <option value="Client">Client (Project)</option>
          <option value="Partner">Partner</option>
        </select>

        {/* Division Filter */}
        <select 
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={filterDivision}
          onChange={(e) => setFilterDivision(e.target.value)}
        >
          <option value="All">All Divisions</option>
          <option value="RealWorkStudio">RealWorkStudio</option>
          <option value="TechWorksStudio">TechWorksStudio</option>
          <option value="Products & AI">Products & AI</option>
        </select>
        
        <div className="ml-auto text-sm text-gray-500">
          Showing {filteredLeads.length} results
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Interest</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Division</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No leads found.</td></tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(lead.createdAt).toLocaleDateString()}
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
                        ${lead.interest === 'Client' ? 'bg-purple-100 text-purple-700' : 
                          lead.interest === 'Student' ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-700'}`}>
                        {lead.interest}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {lead.division || '-'}
                    </td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={lead.message}>
                      {lead.message || '-'}
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