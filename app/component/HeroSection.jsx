"use client";
import React, { useState } from "react";

const HeroSection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult("");
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setProcessing(true);
    setResult("");

    // Simulated processing delay
    setTimeout(() => {
      setProcessing(false);
      setResult("🧠 Diagnosis: No disease detected (example result).");
    }, 2000);
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Title with enhanced styling */}
        <div className="mb-16 group relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl transform scale-150 opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
          
          {/* Main title with multiple effects */}
          <div className="relative">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight relative overflow-hidden">
              {/* Animated text with multiple gradients */}
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-white via-cyan-200 to-white text-transparent bg-clip-text animate-pulse opacity-50"></span>
                <span className="relative bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 text-transparent bg-clip-text drop-shadow-2xl">
                  AI Disease
                </span>
              </span>
              <br />
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text blur-sm opacity-70"></span>
                <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                  Predictor
                </span>
              </span>
              
              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full opacity-60 animate-bounce delay-500"></div>
              <div className="absolute top-1/2 -left-6 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-40 animate-pulse delay-1000"></div>
            </h1>

            {/* Dynamic separator with animation */}
            <div className="flex items-center justify-center mb-6 space-x-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 animate-pulse"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full animate-spin slow"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-500/50"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-full animate-spin slow reverse"></div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-pink-400 animate-pulse delay-500"></div>
            </div>

            {/* Enhanced subtitle with typewriter effect */}
            <div className="relative">
              <p className="text-gray-200 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                <span className="bg-gradient-to-r from-gray-300 to-gray-100 text-transparent bg-clip-text">
                  Advanced AI-powered medical image analysis
                </span>
                <br />
                <span className="text-cyan-300 font-medium">
                  for instant diagnostic insights
                </span>
              </p>
              
              {/* Floating medical icons */}
              <div className="absolute -top-8 left-1/4 opacity-30 animate-float">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3a1 1 0 001-1V7l-7-5zM6 18v-5h8v5H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute -bottom-6 right-1/3 opacity-20 animate-float delay-1000">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 w-full max-w-2xl mx-auto shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:border-purple-500/30">
          
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 mb-8 transition-all duration-500 cursor-pointer group overflow-hidden ${
              dragActive 
                ? 'border-purple-400 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-cyan-500/10 shadow-2xl shadow-purple-500/25 scale-105' 
                : preview 
                  ? 'border-green-400 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/10 shadow-2xl shadow-green-500/25' 
                  : 'border-gray-600 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:via-purple-500/5 hover:to-pink-500/10 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-102'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {!preview ? (
              <div className="text-center relative z-10">
                {/* Enhanced upload icon */}
                <div className="relative mx-auto mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/30">
                    <svg className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  {/* Floating rings around icon */}
                  <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl animate-ping"></div>
                  <div className="absolute inset-0 border border-purple-400/20 rounded-2xl animate-pulse delay-500"></div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-200 text-transparent bg-clip-text">
                  Upload Medical Image
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {dragActive ? (
                    <span className="text-purple-300 font-semibold animate-pulse">
                      🎯 Drop your image here to analyze
                    </span>
                  ) : (
                    <>
                      Drag and drop your medical scan here
                      <br />
                      <span className="text-cyan-300">or click to browse files</span>
                    </>
                  )}
                </p>

                {/* Enhanced file types display */}
                <div className="flex items-center justify-center space-x-6 mb-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>X-Ray</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>MRI</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>CT Scan</span>
                  </div>
                </div>
                
                <div className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Select Medical Image</span>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <div className="relative group/image mb-6">
                  {/* Image container with enhanced styling */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-2 shadow-2xl">
                    <img
                      src={preview}
                      alt="Medical Image Preview"
                      className="w-full max-h-96 object-contain rounded-xl group-hover/image:scale-105 transition-all duration-500"
                    />
                    {/* Overlay with enhanced interaction */}
                    <div className="absolute inset-2 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 rounded-xl flex items-end justify-center pb-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <span className="text-white font-semibold text-lg">Click to change image</span>
                      </div>
                    </div>
                    {/* Image scanning effect */}
                    <div className="absolute inset-2 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12 translate-x-[-200%] group-hover/image:translate-x-[300%] transition-transform duration-2000 rounded-xl"></div>
                  </div>
                </div>

                {/* Success message with enhanced styling */}
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-400/30 rounded-full backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-green-300 font-semibold text-lg">Image Ready for Analysis</p>
                    <p className="text-green-400/80 text-sm">Medical scan uploaded successfully</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleSubmit}
            disabled={!image || processing}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
              !image || processing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95'
            }`}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                <span>Analyzing Image...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Start AI Analysis
              </div>
            )}
            
            {/* Button shine effect */}
            {!processing && image && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            )}
          </button>

          {/* Results Section */}
          {result && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl backdrop-blur-sm animate-fadeIn">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-green-400 font-semibold text-lg mb-1">Analysis Complete</h4>
                  <p className="text-white text-lg">{result}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Powered by advanced machine learning algorithms • Secure & Private • Instant Results
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .slow {
          animation-duration: 3s;
        }
        .reverse {
          animation-direction: reverse;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;