import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, ChevronRight, User, Share2, ArrowLeft } from 'lucide-react';
import hubService from '../services/hubService';
import SEO from '../components/common/SEO';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await hubService.getBlogPostBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
        <Link to="/blog" className="text-xs font-bold text-brand-600">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={`${post.title} | PromoteHub Guides`}
        description={post.excerpt}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/blog" className="hover:text-brand-600">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
              {post.author?.name ? post.author.name[0] : 'E'}
            </div>
            <div>
              <span className="font-bold text-slate-800 block">{post.author?.name || 'Editorial Team'}</span>
              <span className="text-[10px] text-slate-400">{post.author?.role || 'Savings Expert'}</span>
            </div>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96 w-full bg-slate-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-slate-700">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold font-display text-slate-900 pt-3">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1">
                {paragraph.split('\n').map((item, i) => (
                  <li key={i}>{item.replace('- ', '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Footer / CTA */}
      <div className="border-t border-slate-200 pt-6 flex items-center justify-between">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>
        <Link
          to="/deals"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-md"
        >
          Browse Verified Deals
        </Link>
      </div>
    </article>
  );
};

export default BlogPostPage;
