import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate, compact = false, showLabel = true }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        hours: Math.max(0, totalHours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        isExpired: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
        <Clock className="w-3.5 h-3.5" />
        Offer Expired
      </span>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          Ends in:
        </span>
      )}
      <div className="flex items-center gap-1 text-xs font-mono font-extrabold text-amber-900">
        <div className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300">
          {pad(timeLeft.hours)}h
        </div>
        <span>:</span>
        <div className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300">
          {pad(timeLeft.minutes)}m
        </div>
        <span>:</span>
        <div className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300">
          {pad(timeLeft.seconds)}s
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
