import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../services/api';
import blogDataJson from '../../content/blog.json';
import { ArrowLeft, Calendar, User, Clock, RefreshCw } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      
      // 1. Try JSON (Match ID OR Slug)
      // 👇 Change: Check both ID and Slug
      const localPost = blogDataJson.find((p) => p.id === id || p.slug === id);
      
      if (localPost) {
        setPost(localPost);
        setLoading(false);
      } else {
        // 2. Try Database API (Backend ab Slug handle kar lega)
        try {
          const response = await publicApi.getBlogPostById(id);
          const apiPost = response.data?.data?.post;
          if (apiPost) {
            setPost(apiPost);
          }
        } catch (error) {
          console.error("Post not found", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadPost();
  }, [id]);

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
          <Link to="/blog" className="text-indigo-600 hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-1" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Word count logic
  const contentText = post.content || "";
  const wordCount = contentText.replace(/<[^>]*>?/gm, '').split(/\s+/).length; // Strip HTML tags for count
  const readingTime = Math.ceil(wordCount / 200);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>{post.metaTitle || post.title} | JASIQ Labs</title>
        <meta name="description" content={post.metaDesc || post.summary} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Articles
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
               <img 
                 src={post.coverImage} 
                 alt={post.title} 
                 className="w-full h-full object-cover" 
               />
            </div>
          )}

          <div className="p-8 md:p-12">
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 font-medium">
              <span className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {post.category || 'Tech'}
              </span>
              <span className="flex items-center">
                <Calendar size={16} className="mr-1.5" />
                {formatDate(post.createdAt || post.date)}
              </span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1.5" />
                {readingTime} min read
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>
            
            {/* ✨ MAIN CONTENT (HTML Rendering) ✨ */}
            <div 
              className="prose prose-lg prose-indigo max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 
              prose-p:text-gray-700 prose-p:leading-relaxed 
              prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Footer */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-4">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Written by</p>
                <p className="text-lg font-bold text-gray-900">{post.author || 'Admin'}</p>
              </div>
            </div>

          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;