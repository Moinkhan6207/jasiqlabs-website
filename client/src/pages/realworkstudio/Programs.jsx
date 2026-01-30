import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import ProgramCard from "../../components/realworkstudio/ProgramCard";
import apiService from "../../services/api";

export default function Programs() {
  const c = content;
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await apiService.public.getPrograms();
        setPrograms(response.data.data.programs);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const renderProgramCard = (program) => {
    // Map database fields to component expected format
    const mappedData = {
      id: program.id,
      title: program.name,
      for: program.targetAudience || 'Students and Professionals',
      whatYouLearn: program.features || [],
      skillsYouGain: program.metadata?.skills || [],
      commitment: program.metadata?.duration || 'Flexible'
    };
    
    return <ProgramCard key={program.id} data={mappedData} />;
  };

  return (
    <>
      <Helmet>
        <title>Programs — RealWorkStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Choose a learning path based on your interest and career goals. MERN Stack and Python programs available."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {c.programs.title}
            </h1>
            <p className="text-xl text-primary-100">
              {c.programs.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4 animate-spin">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Loading programs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load programs</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
              <p className="text-gray-500">Our programs are being updated. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {programs.map(renderProgramCard)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}








