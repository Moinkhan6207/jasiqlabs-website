import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import blogData from '../../content/blog.json';
import { Calendar, User, ArrowRight, Mail, Tag } from 'lucide-react';

const BlogList = () => {
  // Safety Check: Agar data khali hai to crash na ho
  if (!blogData || blogData.length === 0) {
    return <div className="text-center py-20">No posts found.</div>;
  }

  // Logic: 
  // 1. Pehla post (Index 0) banega "Featured Post" (Bada wala)
  // 2. Baaki ke posts (Index 1 se end tak) banenge "Normal List"
  const featuredPost = blogData[0];
  const otherPosts = blogData.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Blog & Insights | JASIQ Labs</title>
        <meta name="description" content="Stay updated with the latest trends in web development, AI, and technology from the JASIQ Labs team." />
      </Helmet>

      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 text-center shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          JASIQ Insights
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
          Tutorials, career advice, and engineering thoughts for the modern developer.
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        
        {/* 2. ✨ FEATURED POST (Sabse upar bada card) */}
        <div className="mb-16 relative z-10">
          <Link to={`/blog/${featuredPost.id}`} className="group block">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden md:flex">
              
              {/* Left: Decorative Gradient (Image Placeholder) */}
              <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 to-blue-800 min-h-[250px] flex items-center justify-center p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="relative z-10 text-center">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-white/30">
                    Featured Article
                  </span>
                  <div className="opacity-80 text-sm mt-2 flex items-center justify-center gap-2">
                    <Calendar size={14} /> {featuredPost.date}
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="p-8 md:w-7/12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                    <Tag size={12} /> {featuredPost.category || 'Tech'}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 mb-6 text-lg line-clamp-2 md:line-clamp-3">
                  {featuredPost.summary}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <User size={16} className="mr-2 text-indigo-500" />
                    {featuredPost.author}
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 3. 📬 NEWSLETTER SECTION (Page ko "bhara hua" dikhane ke liye) */}
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 mb-16 text-white shadow-lg relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
          
          <div className="relative z-10 md:flex md:items-center md:justify-between gap-8">
            <div className="mb-6 md:mb-0 max-w-lg">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <Mail className="w-6 h-6 text-indigo-400" /> 
                Join our Weekly Developer Newsletter
              </h3>
              <p className="text-slate-300">
                Get the latest tech trends, MERN stack tips, and internship updates directly in your inbox. No spam, ever.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-lg text-gray-900 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-indigo-500/30 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* 4. 📝 LATEST ARTICLES GRID (Baaki ke posts) */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full hover:-translate-y-1">
                <div className="p-6 flex flex-col h-full">
                  {/* Category */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {post.category || 'Tech'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">
                    {post.summary}
                  </p>

                  {/* Footer Info */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <User size={14} className="mr-1" /> {post.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" /> {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogList;