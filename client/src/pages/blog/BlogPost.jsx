import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../services/api'; // ✅ API
import blogDataJson from '../../content/blog.json'; // ✅ JSON
import { ArrowLeft, Calendar, User, Clock, RefreshCw } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC: Fetch from JSON or API ---
  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);

      // 1. Try finding in JSON first
      const localPost = blogDataJson.find((p) => p.id === id);

      if (localPost) {
        setPost(localPost);
        setLoading(false);
      } else {
        // 2. Not found in JSON, try API
        try {
          const response = await publicApi.getBlogPostById(id);
          const apiPost = response.data?.data?.post;
          if (apiPost) {
            setPost(apiPost);
          }
        } catch (error) {
          console.error("Post not found in DB either", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPost();
  }, [id]);

  // --- LOADING / ERROR STATES ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="animate-spin text-indigo-600 h-8 w-8" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="text-blue-600 hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-1" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // --- CALCULATIONS & FORMATTING (Old Logic) ---
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput; // Return as is if already formatted string
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // --- DESIGN SECTION (Old UI Restored) ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>{post.metaTitle || post.title} | JASIQ Labs Blog</title>
        <meta name="description" content={post.metaDesc || post.summary} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to Blog
        </Link>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          
          {/* Cover Image (If exists) - Added to match API data capabilities */}
          {post.coverImage && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
               <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
              <span className="flex items-center mr-6 mb-2 sm:mb-0">
                <Calendar size={16} className="mr-1" />
                {formatDate(post.createdAt || post.date)}
              </span>
              <span className="flex items-center mr-6 mb-2 sm:mb-0">
                <User size={16} className="mr-1" />
                {post.author || 'Admin'}
              </span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {readingTime} min read
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Share this post
              </h3>
              <div className="flex space-x-4">
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-700 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">More from our blog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Note: Recommendations ke liye hum abhi sirf JSON data use kar rahe hain taaki complexity kam rahe */}
            {blogDataJson
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map(relatedPost => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.id}`}
                  className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{relatedPost.title}</h4>
                  <p className="text-gray-600 text-sm">{relatedPost.summary}</p>
                  <div className="mt-3 text-sm text-gray-500 flex items-center">
                    <span>{relatedPost.date}</span>
                    <span className="mx-2">•</span>
                    <span>{Math.ceil(relatedPost.content.split(/\s+/).length / 200)} min read</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;