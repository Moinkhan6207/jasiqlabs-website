import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, FileText, Download } from 'lucide-react';
import { toast } from 'react-hot-toast'; // ✅ Correct Library
import api from '../../services/api';     // ✅ Correct API Import

const JobApplicationsPage = () => {
  const { id } = useParams(); // ✅ Correct Param (id, not jobId)
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Applications
        const appResponse = await api.careers.getApplications(id); // ✅ API Call Corrected
        // Backend response structure: { data: { applications: [...] } }
        setApplications(appResponse.data?.data?.applications || []);

        // 2. Fetch Job Details (Title dikhane ke liye)
        const jobResponse = await api.careers.getById(id);
        setJobTitle(jobResponse.data?.data?.job?.title || 'Job Opening');
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/careers')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex items-center gap-2"
          title="Back to Jobs"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-500 text-sm">
            Candidates for <span className="font-semibold text-blue-600">{jobTitle}</span>
          </p>
        </div>
      </div>

      {/* Table Section (Simple Tailwind Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Name</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume / Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                       <span className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                       Loading data...
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500">
                    <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No applications yet</p>
                    <p className="text-sm">There are no applications for this job posting yet.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    {/* Date */}
                    <td className="p-5 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400"/>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Name & Cover Letter */}
                    <td className="p-5">
                      <div className="font-medium text-gray-900">{app.name}</div>
                      {app.coverLetter && (
                        <div className="text-xs text-gray-500 mt-1 italic max-w-xs truncate" title={app.coverLetter}>
                          "{app.coverLetter}"
                        </div>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <span className="flex items-center gap-2"><Mail size={14}/> {app.email}</span>
                        <span className="flex items-center gap-2"><Phone size={14}/> {app.phone}</span>
                      </div>
                    </td>

                    {/* Resume Link */}
                    <td className="p-5">
                      <a 
                        href={app.resumeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-100"
                      >
                        <Download size={16} /> View Resume
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage;