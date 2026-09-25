import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import Button from './Button';
import { useToast } from '../../context/ToastContext';

const ReportOfferModal = ({ isOpen, onClose, offer }) => {
  const { addToast } = useToast();
  const [reason, setReason] = useState('expired');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !offer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast('Thank you! Our verification team will review this offer shortly.', 'success');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-lg font-display">
            <AlertTriangle className="w-5 h-5" />
            <span>Report an Issue with Offer</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Help us maintain 100% verified accuracy for <span className="font-semibold text-slate-700">{offer.title}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">What is the problem?</label>
            <div className="space-y-2 text-xs">
              {[
                { id: 'expired', label: 'Promo code or deal has expired' },
                { id: 'wrong_discount', label: 'Discount percentage or price is incorrect' },
                { id: 'out_of_stock', label: 'Item is out of stock on merchant site' },
                { id: 'broken_link', label: 'Merchant link is broken or redirects to wrong page' },
                { id: 'other', label: 'Other issue' }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="report_reason"
                    value={opt.id}
                    checked={reason === opt.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Additional details (Optional)</label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Coupon said invalid when applied on app..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={submitting} className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportOfferModal;
