import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowRight, User } from 'lucide-react';
import hubService from '../services/hubService';
import SEO from '../components/common/SEO';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await hubService.getBlogPosts();
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEO
        title="Shopping Tips, Coupon Guides & Savings Blog | PromoteHub"
        description="Expert advice on how to stack coupons, maximize credit card cashback, and find verified deals on Amazon, Flipkart, and Myntra."
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Savings Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Shopping Guides & Deal Hacks
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
          Learn how to combine promo codes, avoid deceptive pricing tricks, and withdraw real money using UPI cashback.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post._id || post.slug}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 card-hover overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <Link to={`/blog/${post.slug}`} className="block h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </Link>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link to={`/blog/${post.slug}`} className="block">
                  <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Author Footer */}
            <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                  {post.author?.name ? post.author.name[0] : 'P'}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">{post.author?.name || 'Editorial Team'}</span>
                  <span className="text-[10px] text-slate-400">{post.publishedAt?.split('T')[0] || 'Recently'}</span>
                </div>
              </div>

              <Link
                to={`/blog/${post.slug}`}
                className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogListPage;
