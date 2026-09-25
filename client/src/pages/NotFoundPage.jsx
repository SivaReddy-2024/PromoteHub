import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Megaphone className="w-8 h-8 rotate-180" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight font-display">
          404
        </h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The campaign page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
