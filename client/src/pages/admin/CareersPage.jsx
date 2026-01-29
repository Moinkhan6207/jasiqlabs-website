import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Briefcase, MapPin, RefreshCw, Eye, Power, FileText, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const initialForm = {
    title: '',
    type: 'FULLTIME',
    location: '',
    description: '',
    salaryRange: '',
    experience: '',
    status: 'DRAFT',
    requirements: '',     
    responsibilities: ''  
  };

  const [formData, setFormData] = useState(initialForm);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.careers.getAll();
      setJobs(response.data?.data?.jobs || []);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const updatedJobs = jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j);
      setJobs(updatedJobs);
      await api.careers.update(job.id, { status: newStatus });
      toast.success(`Job ${newStatus === 'PUBLISHED' ? 'Published' : 'Unpublished'}`);
    } catch (error) {
      toast.error('Failed to update status');
      fetchJobs();
    }
  };

  // 👇 NEW: Toggle "Accepting Applications" Status
  const handleApplicationToggle = async (job) => {
    try {
      // Optimistic Update
      const updatedJobs = jobs.map(j => 
        j.id === job.id ? { ...j, acceptingApplications: !j.acceptingApplications } : j
      );
      setJobs(updatedJobs);

      // We need to call the specific endpoint for toggling application status
      // Ensure this method exists in your api.js services
      await api.careers.toggleApplicationStatus(job.id); 
      
      const statusMsg = !job.acceptingApplications ? 'OPEN' : 'CLOSED';
      toast.success(`Applications are now ${statusMsg} for this job.`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle application status');
      fetchJobs(); // Revert
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job opening permanently?')) {
      try {
        await api.careers.delete(id);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(line => line.trim() !== ''),
        responsibilities: formData.responsibilities.split('\n').filter(line => line.trim() !== '')
      };

      if (editingJob) {
        await api.careers.update(editingJob.id, payload);
        toast.success('Job updated successfully');
      } else {
        await api.careers.create(payload);
        toast.success('Job posted successfully');
      }
      closeModal();
      fetchJobs();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      type: job.type,
      location: job.location,
      description: job.description,
      salaryRange: job.salaryRange || '',
      experience: job.experience || '',
      status: job.status,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
    setFormData(initialForm);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Careers & Jobs</h1>
          <p className="text-gray-500 text-sm">Manage job openings and applicants</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500"><RefreshCw className="animate-spin h-6 w-6 mx-auto mb-2"/>Loading jobs...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">No job openings found.</td></tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                         Exp: {job.experience || 'N/A'}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 flex items-center gap-1"><Briefcase size={14}/> {job.type}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <button 
                        onClick={() => handleStatusToggle(job)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                          job.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {job.status === 'PUBLISHED' ? <Eye size={12} className="mr-1"/> : null}
                        {job.status}
                      </button>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                         {/* Toggle Switch for Applications */}
                        <button
                          onClick={() => handleApplicationToggle(job)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            job.acceptingApplications ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                          title={job.acceptingApplications ? "Applications OPEN" : "Applications CLOSED"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              job.acceptingApplications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="text-xs text-gray-500 font-medium">
                          {job.acceptingApplications ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => navigate(`/admin/careers/${job.id}/applications`)} 
                          className="text-indigo-600 hover:text-indigo-800" 
                          title="View Applications"
                        >
                          <Users size={18} />
                        </button>
                        <button 
                          onClick={() => openEditModal(job)} 
                          className="text-blue-600 hover:text-blue-800" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(job.id)} 
                          className="text-red-500 hover:text-red-700" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal - Same as before */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* ... (Modal Header) ... */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* ... (Form Content - No Changes needed here) ... */}
               {/* Use the same form structure as in your previous message */}
               <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="FULLTIME">Full Time</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="CONTRACT">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                   <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-medium text-gray-700 mb-1">Salary</label><input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" value={formData.salaryRange} onChange={(e) => setFormData({...formData, salaryRange: e.target.value})} /></div>
                   <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience</label><input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Requirements</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" rows="6" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} placeholder="- Req 1&#10;- Req 2"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" rows="6" value={formData.responsibilities} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})} placeholder="- Resp 1&#10;- Resp 2"></textarea>
                </div>
              </div>
              <div className="md:col-span-2 pt-4 flex gap-3 border-t">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;