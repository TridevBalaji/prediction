'use client';

import React, { useState } from 'react';
import { Brain, Loader2, AlertCircle } from 'lucide-react';

const GroqAPI = ({ diseaseName, confidence }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateMedicalAdvice = async () => {
    setResponse("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diseaseName,
          confidence,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error generating medical advice:", error);
      setError("Failed to generate medical advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateMedicalAdvice}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Generating AI Medical Advice...
          </>
        ) : (
          <>
            <Brain className="h-5 w-5 mr-2" />
            Get AI Medical Advice
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 backdrop-blur-xl">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-300 font-medium">Error</span>
          </div>
          <p className="text-red-400 mt-1">{error}</p>
        </div>
      )}

      {response && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-400" />
            AI Medical Advice
          </h3>
          <div className="prose prose-invert max-w-none">
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroqAPI; 