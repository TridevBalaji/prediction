'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';

const PrecautionButton = ({ prediction }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePrecaution = async () => {
    if (!prediction) return;
    
    setLoading(true);
    
    try {
      // Store the prediction data in sessionStorage for the next page
      sessionStorage.setItem('diseasePrediction', JSON.stringify(prediction));
      
      // Navigate to the precaution page
      router.push('/precautions');
    } catch (error) {
      console.error('Error navigating to precautions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!prediction) return null;

  return (
    <button
      onClick={handlePrecaution}
      disabled={loading}
      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center transform hover:scale-105 disabled:hover:scale-100 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25"
    >
      {loading ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin mr-3" />
          Loading Precautions...
        </>
      ) : (
        <>
          <Shield className="h-6 w-6 mr-3" />
          Get Precautions & Solutions
        </>
      )}
    </button>
  );
};

export default PrecautionButton; 