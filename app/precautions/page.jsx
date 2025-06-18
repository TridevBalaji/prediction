'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, AlertTriangle, Brain, Shield, Activity } from 'lucide-react';
import GroqAPI from '../../components/GroqAPI';

export default function PrecautionsPage() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get prediction data from sessionStorage
    const storedPrediction = sessionStorage.getItem('diseasePrediction');
    if (storedPrediction) {
      setPrediction(JSON.parse(storedPrediction));
    }
    setLoading(false);
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const getSeverityColor = (className) => {
    const highSeverity = ['Burns', 'Diabetic Wounds', 'Laseration', 'Surgical Wounds', 'glioma', 'meningioma', 'pituitary'];
    const mediumSeverity = ['Cut', 'Pressure Wounds', 'Venous Wounds', 'Bruises'];
    
    if (highSeverity.includes(className)) return 'text-red-300 bg-red-900/30 border-red-500/40 shadow-red-500/20';
    if (mediumSeverity.includes(className)) return 'text-orange-300 bg-orange-900/30 border-orange-500/40 shadow-orange-500/20';
    if (className === 'Normal' || className === 'notumor') return 'text-emerald-300 bg-emerald-900/30 border-emerald-500/40 shadow-emerald-500/20';
    return 'text-cyan-300 bg-cyan-900/30 border-cyan-500/40 shadow-cyan-500/20';
  };

  const getSeverityLevel = (className) => {
    const highSeverity = ['Burns', 'Diabetic Wounds', 'Laseration', 'Surgical Wounds', 'glioma', 'meningioma', 'pituitary'];
    const mediumSeverity = ['Cut', 'Pressure Wounds', 'Venous Wounds', 'Bruises'];
    
    if (highSeverity.includes(className)) return 'High';
    if (mediumSeverity.includes(className)) return 'Medium';
    if (className === 'Normal' || className === 'notumor') return 'Low';
    return 'Medium';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading precautions...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-4">No disease prediction found</p>
          <button
            onClick={handleBack}
            className="bg-cyan-600 text-white px-6 py-3 rounded-xl hover:bg-cyan-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-xl hover:bg-slate-700/50 transition-colors backdrop-blur-xl border border-slate-700/50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-300" />
            <span className="text-slate-300">Back to Analysis</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Medical Precautions
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Disease Information */}
            <div className="space-y-6">
              <div className="bg-slate-900/40 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50">
                <h2 className="text-2xl font-semibold mb-6 text-slate-200 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-orange-400" />
                  Disease Analysis
                </h2>
                
                <div className={`rounded-xl p-6 border-2 backdrop-blur-xl shadow-xl ${getSeverityColor(prediction.predicted_class)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{prediction.predicted_class}</h3>
                      <p className="text-sm opacity-75">Primary Classification</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{prediction.confidence_percentage}</div>
                      <p className="text-sm opacity-75">Confidence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Severity Level: {getSeverityLevel(prediction.predicted_class)}</span>
                  </div>
                </div>

                {prediction.top_predictions && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-200 mb-3">Alternative Diagnoses</h4>
                    <div className="space-y-2">
                      {prediction.top_predictions.slice(0, 3).map((pred, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg backdrop-blur-xl border border-slate-700/50"
                        >
                          <span className="font-medium text-slate-200">{pred.class}</span>
                          <span className="text-slate-400">{(pred.confidence * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl shadow-amber-500/10">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-amber-400 mr-3 mt-1" />
                  <div>
                    <p className="text-amber-300 font-semibold text-lg">Important Medical Disclaimer</p>
                    <p className="text-amber-400 text-sm mt-2">
                      This AI analysis and advice is for informational purposes only and should not replace professional medical diagnosis or treatment. Always consult with a qualified healthcare provider for proper medical care.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Medical Advice */}
            <div className="bg-slate-900/40 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50">
              <h2 className="text-2xl font-semibold mb-6 text-slate-200 flex items-center">
                <Brain className="h-6 w-6 mr-3 text-blue-400" />
                AI Medical Advisor
              </h2>
              
              <GroqAPI 
                diseaseName={prediction.predicted_class}
                confidence={parseFloat(prediction.confidence_percentage)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 