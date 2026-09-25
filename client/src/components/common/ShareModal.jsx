import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ShareModal = ({ isOpen, onClose, offer }) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !offer) return null;

  const shareUrl = window.location.origin + `/deal/${offer.slug || offer._id}`;
  const shareText = `Check out this amazing deal: ${offer.title} - ${offer.discountPercentage}% OFF on ${offer.brandName}!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Deal link copied to clipboard! 🔗', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg font-display">
            <Share2 className="w-5 h-5 text-brand-600" />
            <span>Share this Offer</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2">
          {offer.title}
        </p>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors gap-1.5"
          >
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors gap-1.5"
          >
            <Send className="w-6 h-6 text-sky-600" />
            <span className="text-xs font-semibold">Telegram</span>
          </button>

          <button
            onClick={handleTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors gap-1.5"
          >
            <span className="font-extrabold text-lg">𝕏</span>
            <span className="text-xs font-semibold">Twitter</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Or Copy Direct Link
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-slate-600 px-2 flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                copied ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
