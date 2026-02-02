import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { publicApi, pageContent } from '../../services/api'; 
import blogDataJson from '../../content/blog.json'; 
import { Calendar, User, ArrowRight, Mail, Tag, RefreshCw } from 'lucide-react';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default values (Fallback)
  const [blogContent, setBlogContent] = useState({
    blogTitle: 'JASIQ Insights',
    blogSubtitle: 'Tutorials, career advice, and engineering thoughts for the modern developer.',
    newsletterTitle: 'Join our Weekly Developer Newsletter',
    newsletterDesc: 'Get the latest tech trends, MERN stack tips, and internship updates directly in your inbox. No spam, ever.'
  });

  // 1. Fetch Blog Posts (List of articles)
  useEffect(() => {
    const fetchAndMergePosts = async () => {
      try {
        const response = await publicApi.getBlogPosts();
        // Check both paths to be safe
        const dbPosts = response.data?.data?.posts || response.data?.posts || [];
        const allPosts = [...dbPosts, ...blogDataJson];

        const sortedPosts = allPosts.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date);
          const dateB = new Date(b.createdAt || b.date);
          return dateB - dateA; 
        });

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setPosts(blogDataJson);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergePosts();
  }, []);

  // 2. Fetch Blog Page Content (Hero Title, Newsletter, etc.)
  // 🟢 THIS IS THE FIX 🟢
  useEffect(() => {
    const fetchBlogContent = async () => {
      try {
        const response = await pageContent.get('blog', 'hero');
        
        // Console log ke hisaab se 'response' hi main object hai, ya 'response.data' inner object hai.
        // Hum safe side rehne ke liye check kar rahe hain.
        
        // Step 1: Inner Data object nikalo
        const apiData = response.data || response; 

        // Step 2: Content object check karo (Directly under data, no extra .data)
        if (apiData?.content) {
           const c = apiData.content;
           
           setBlogContent({
             blogTitle: c.blogTitle || 'JASIQ Insights',
             blogSubtitle: c.blogSubtitle || 'Tutorials, career advice, and engineering thoughts for the modern developer.',
             newsletterTitle: c.newsletterTitle || 'Join our Weekly Developer Newsletter',
             newsletterDesc: c.newsletterDesc || 'Get the latest tech trends, MERN stack tips, and internship updates directly in your inbox. No spam, ever.'
           });
        }
      } catch (error) {
        console.error("Error fetching blog content:", error);
      }
    };

    fetchBlogContent();
  }, []);

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput; 
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="animate-spin text-indigo-600 h-8 w-8" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-20 bg-gray-50">No posts found.</div>;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Blog & Insights | JASIQ Labs</title>
        <meta name="description" content="Stay updated with the latest trends in web development, AI, and technology from the JASIQ Labs team." />
      </Helmet>

      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-12 text-center shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          {blogContent.blogTitle}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
          {blogContent.blogSubtitle}
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        
        {/* 2. ✨ FEATURED POST */}
        <div className="mb-16 relative z-10">
          <Link to={`/blog/${featuredPost.slug}`} className="group block">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden md:flex">
              
              {/* Left: Image or Gradient */}
              <div className={`md:w-5/12 min-h-[250px] flex items-center justify-center p-8 relative overflow-hidden ${!featuredPost.coverImage ? 'bg-gradient-to-br from-indigo-600 to-blue-800' : 'bg-gray-100'}`}>
                {featuredPost.coverImage ? (
                  <img 
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="relative z-10 text-center text-white">
                      <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-white/30">
                        Featured Article
                      </span>
                      <div className="opacity-80 text-sm mt-2 flex items-center justify-center gap-2">
                        <Calendar size={14} /> {formatDate(featuredPost.createdAt || featuredPost.date)}
                      </div>
                    </div>
                  </>
                )}
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
                    {featuredPost.author || 'Admin'}
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 3. 📬 NEWSLETTER SECTION */}
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 mb-16 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
          <div className="relative z-10 md:flex md:items-center md:justify-between gap-8">
            <div className="mb-6 md:mb-0 max-w-lg">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <Mail className="w-6 h-6 text-indigo-400" /> 
                {blogContent.newsletterTitle}
              </h3>
              <p className="text-slate-300">
                {blogContent.newsletterDesc}
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

        {/* 4. 📝 LATEST ARTICLES GRID */}
        {otherPosts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-8">
              <div className="h-8 w-1.5 bg-indigo-600 rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-gray-900">Latest Articles</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full hover:-translate-y-1">
                  
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {post.category || 'Tech'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">
                      {post.summary}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <User size={14} className="mr-1" /> {post.author || 'Admin'}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" /> {formatDate(post.createdAt || post.date)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;