import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Filter } from 'lucide-react';
import hubService from '../services/hubService';
import BankOfferCard from '../components/bankOffers/BankOfferCard';
import SEO from '../components/common/SEO';

const BankOffersPage = () => {
  const [bankOffers, setBankOffers] = useState([]);
  const [selectedBank, setSelectedBank] = useState('All');
  const [selectedCardType, setSelectedCardType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankOffers = async () => {
      setLoading(true);
      try {
        const data = await hubService.getBankOffers();
        setBankOffers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBankOffers();
  }, []);

  const banksList = ['All', 'HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Kotak Mahindra Bank', 'American Express'];
  const cardTypesList = ['All', 'Credit Card', 'Debit Card', 'Credit & Debit Card'];

  const filteredOffers = bankOffers.filter((o) => {
    if (selectedBank !== 'All' && !o.bankName.toLowerCase().includes(selectedBank.toLowerCase())) return false;
    if (selectedCardType !== 'All' && !o.cardType.toLowerCase().includes(selectedCardType.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="Bank Offers & Credit Card Deals | HDFC, ICICI, SBI, Axis"
        description="Save extra with exclusive bank offers. Instant discounts on HDFC, ICICI, SBI, and Axis credit/debit cards on Amazon, Flipkart, Croma, and Myntra."
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateway Discounts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Exclusive Bank Card Offers & EMI Deals
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
          Stack bank instant discounts on top of existing merchant coupons. Select your bank below to see all active card perks.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Bank Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {banksList.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBank(b)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedBank === b
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Card Type Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Card Type:</span>
          {cardTypesList.map((ct) => (
            <button
              key={ct}
              onClick={() => setSelectedCardType(ct)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCardType === ct
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <BankOfferCard key={offer._id || offer.bankName} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 font-display">No Bank Offers Found</h3>
          <p className="text-xs text-slate-500">
            No active offers for the selected bank combination. Try switching back to "All".
          </p>
          <button
            onClick={() => { setSelectedBank('All'); setSelectedCardType('All'); }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BankOffersPage;
