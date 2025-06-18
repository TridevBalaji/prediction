'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, CheckCircle, Activity, Heart, Camera, Zap, Brain, Shield } from 'lucide-react';
import * as THREE from 'three';
import PrecautionButton from '../components/PrecautionButton';

// Three.js Background Component
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const createFloatingShape = (geometry, color, position) => {
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.userData = { 
        originalY: position[1],
        rotationSpeed: Math.random() * 0.02 + 0.01,
        floatSpeed: Math.random() * 0.01 + 0.005
      };
      scene.add(mesh);
      return mesh;
    };

    const shapes = [
      createFloatingShape(new THREE.TetrahedronGeometry(0.5), 0xff00ff, [-3, 2, -2]),
      createFloatingShape(new THREE.OctahedronGeometry(0.4), 0x00ff00, [3, -2, -3]),
      createFloatingShape(new THREE.IcosahedronGeometry(0.3), 0x0000ff, [0, 3, -4]),
      createFloatingShape(new THREE.TorusGeometry(0.3, 0.1, 8, 16), 0xffff00, [-4, -3, -1]),
      createFloatingShape(new THREE.SphereGeometry(0.2, 8, 8), 0xff8800, [4, 1, -5])
    ];

    // Create DNA-like helix
    const helixGeometry = new THREE.BufferGeometry();
    const helixPoints = [];
    const helixCount = 100;
    
    for (let i = 0; i < helixCount; i++) {
      const angle = (i / helixCount) * Math.PI * 4;
      const radius = 0.5;
      const height = (i / helixCount) * 4 - 2;
      
      helixPoints.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
    }
    
    helixGeometry.setAttribute('position', new THREE.Float32BufferAttribute(helixPoints, 3));
    const helixMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.6 
    });
    const helix = new THREE.Line(helixGeometry, helixMaterial);
    helix.position.set(0, 0, -8);
    scene.add(helix);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Animate floating shapes
      shapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed;
        shape.rotation.y += shape.userData.rotationSpeed * 0.5;
        shape.position.y = shape.userData.originalY + Math.sin(Date.now() * shape.userData.floatSpeed) * 0.5;
      });

      // Rotate helix
      helix.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}
    />
  );
};

// 3D Human Body Visualization Component
const HumanBody3D = ({ prediction }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const bodyPartsRef = useRef({});
  const rotationRef = useRef(0);

  // Disease to body part mapping
  const diseaseMapping = {
    'glioma': ['head'],
    'meningioma': ['head'],
    'pituitary': ['head'],
    'Burns': ['leftArm', 'rightArm', 'leftHand', 'rightHand'],
    'Cut': ['leftArm', 'rightArm', 'leftHand', 'rightHand'],
    'Laceration': ['leftArm', 'rightArm', 'leftHand', 'rightHand'],
    'Diabetic Wounds': ['leftLeg', 'rightLeg', 'leftFoot', 'rightFoot'],
    'Pressure Wounds': ['torso', 'leftLeg', 'rightLeg'],
    'Venous Wounds': ['leftLeg', 'rightLeg', 'leftFoot', 'rightFoot'],
    'Surgical Wounds': ['torso', 'leftArm', 'rightArm'],
    'Bruises': ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'],
    'Abrasions': ['leftHand', 'rightHand', 'leftArm', 'rightArm'],
    'Surgical Wounds': ['torso', 'leftArm', 'rightArm']
  };

  useEffect(() => {
    if (!mountRef.current || !prediction) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create a group to hold all body parts for easier rotation
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Create human body parts with proper anatomical positioning
    const createBodyPart = (geometry, position, name, material, rotation = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { name, originalMaterial: material.clone() };
      bodyGroup.add(mesh);
      bodyPartsRef.current[name] = mesh;
      return mesh;
    };

    // Materials
    const skinMaterial = new THREE.MeshPhongMaterial({
      color: 0xffdbac,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });

    const affectedMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 50,
      transparent: true,
      opacity: 0.8,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    });

    // Create body parts with proper anatomical alignment
    // Head
    createBodyPart(new THREE.SphereGeometry(0.6, 16, 16), [0, 2.5, 0], 'head', skinMaterial);
    
    // Neck
    createBodyPart(new THREE.CylinderGeometry(0.2, 0.25, 0.4, 12), [0, 2.1, 0], 'neck', skinMaterial);
    
    // Torso (chest and abdomen)
    createBodyPart(new THREE.CylinderGeometry(0.8, 0.9, 2.2, 16), [0, 0.8, 0], 'torso', skinMaterial);
    
    // Arms with proper shoulder positioning
    createBodyPart(new THREE.CylinderGeometry(0.15, 0.18, 1.4, 12), [-1.2, 1.8, 0], 'leftArm', skinMaterial, [0, 0, -0.3]);
    createBodyPart(new THREE.CylinderGeometry(0.15, 0.18, 1.4, 12), [1.2, 1.8, 0], 'rightArm', skinMaterial, [0, 0, 0.3]);
    
    // Forearms
    createBodyPart(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 12), [-1.4, 0.8, 0], 'leftForearm', skinMaterial, [0, 0, -0.2]);
    createBodyPart(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 12), [1.4, 0.8, 0], 'rightForearm', skinMaterial, [0, 0, 0.2]);
    
    // Hands
    createBodyPart(new THREE.SphereGeometry(0.2, 12, 12), [-1.5, -0.2, 0], 'leftHand', skinMaterial);
    createBodyPart(new THREE.SphereGeometry(0.2, 12, 12), [1.5, -0.2, 0], 'rightHand', skinMaterial);
    
    // Legs with proper hip positioning
    createBodyPart(new THREE.CylinderGeometry(0.25, 0.3, 1.8, 12), [-0.4, -0.8, 0], 'leftLeg', skinMaterial);
    createBodyPart(new THREE.CylinderGeometry(0.25, 0.3, 1.8, 12), [0.4, -0.8, 0], 'rightLeg', skinMaterial);
    
    // Feet
    createBodyPart(new THREE.BoxGeometry(0.25, 0.15, 0.6), [-0.4, -2.6, 0.1], 'leftFoot', skinMaterial);
    createBodyPart(new THREE.BoxGeometry(0.25, 0.15, 0.6), [0.4, -2.6, 0.1], 'rightFoot', skinMaterial);

    // Highlight affected body parts
    const affectedParts = diseaseMapping[prediction.predicted_class] || [];
    affectedParts.forEach(partName => {
      if (bodyPartsRef.current[partName]) {
        bodyPartsRef.current[partName].material = affectedMaterial.clone();
      }
    });

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Smooth rotation of the entire body
      rotationRef.current += 0.005;
      bodyGroup.rotation.y = rotationRef.current;

      // Breathing animation for torso
      if (bodyPartsRef.current.torso) {
        const breathScale = 1 + Math.sin(Date.now() * 0.003) * 0.03;
        bodyPartsRef.current.torso.scale.y = breathScale;
        bodyPartsRef.current.torso.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.02;
      }

      // Pulsing animation for affected parts
      affectedParts.forEach(partName => {
        if (bodyPartsRef.current[partName]) {
          const part = bodyPartsRef.current[partName];
          const pulse = Math.sin(Date.now() * 0.008) * 0.08 + 1;
          part.scale.setScalar(pulse);
          
          // Animate emissive intensity
          if (part.material.emissiveIntensity !== undefined) {
            part.material.emissiveIntensity = 0.2 + Math.sin(Date.now() * 0.008) * 0.2;
          }
        }
      });

      // Subtle head movement
      if (bodyPartsRef.current.head) {
        bodyPartsRef.current.head.rotation.y = Math.sin(Date.now() * 0.002) * 0.1;
      }

      // Arm swaying animation
      if (bodyPartsRef.current.leftArm && bodyPartsRef.current.rightArm) {
        bodyPartsRef.current.leftArm.rotation.z = Math.sin(Date.now() * 0.004) * 0.1 - 0.3;
        bodyPartsRef.current.rightArm.rotation.z = Math.sin(Date.now() * 0.004 + Math.PI) * 0.1 + 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [prediction]);

  if (!prediction) return null;

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-slate-200 mb-4 text-lg">3D Body Visualization</h4>
      <div className="relative">
        <div ref={mountRef} className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-700/50" />
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xl px-3 py-2 rounded-lg border border-slate-700/50">
          <p className="text-slate-300 text-sm font-medium">Affected Areas Highlighted</p>
        </div>
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xl px-3 py-2 rounded-lg border border-slate-700/50">
          <p className="text-slate-300 text-sm font-medium">Rotating View</p>
        </div>
      </div>
    </div>
  );
};

// 3D Loading Animation Component
const ThreeLoadingAnimation = ({ loading }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || !loading) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create DNA double helix
    const createHelix = (radius, height, turns, color, offset) => {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 100;
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2 * turns;
        const y = (i / segments) * height - height / 2;
        
        points.push(
          Math.cos(angle) * radius + offset,
          y,
          Math.sin(angle) * radius
        );
      }
      
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const material = new THREE.LineBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.8 
      });
      return new THREE.Line(geometry, material);
    };

    const helix1 = createHelix(0.3, 3, 2, 0x00ffff, 0.1);
    const helix2 = createHelix(0.3, 3, 2, 0xff00ff, -0.1);
    scene.add(helix1);
    scene.add(helix2);

    // Create connecting bars
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.6);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffff00, 
        transparent: true, 
        opacity: 0.6 
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.y = (i / 7) * 3 - 1.5;
      bar.rotation.z = Math.PI / 2;
      scene.add(bar);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      helix1.rotation.y += 0.02;
      helix2.rotation.y += 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="flex items-center justify-center">
      <div ref={mountRef} className="w-[200px] h-[200px]" />
      <div className="ml-4">
        <p className="text-slate-300 font-semibold">Analyzing with AI...</p>
        <p className="text-slate-400 text-sm">Processing medical image data</p>
      </div>
    </div>
  );
};

// Upload Component
const ImageUpload = ({ onFileSelect, preview, selectedFile, fileInputRef }) => {
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="relative border-2 border-dashed border-slate-600 rounded-2xl p-10 text-center hover:border-cyan-400 transition-all duration-500 cursor-pointer bg-slate-900/40 hover:bg-slate-800/40 backdrop-blur-xl group overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {preview ? (
        <div className="relative space-y-4 animate-fadeIn">
          <div className="relative">
          <img
            src={preview}
            alt="Preview"
              className="max-w-full max-h-72 mx-auto rounded-xl shadow-2xl ring-2 ring-cyan-500/30 group-hover:ring-cyan-400/50 transition-all duration-500 transform group-hover:scale-105"
          />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>
          <p className="text-sm text-slate-300 font-medium">
            {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      ) : (
        <div className="relative space-y-6">
          <div className="relative">
            <Upload className="h-20 w-20 text-slate-400 mx-auto group-hover:text-cyan-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
              Drop your medical image here
            </p>
            <p className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors duration-300">
              or click to browse files
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Server Status Component
const ServerStatus = ({ serverHealth }) => (
  <div className="mt-8 flex items-center justify-center space-x-6">
    <div className="flex items-center space-x-3 bg-slate-800/60 px-6 py-3 rounded-full backdrop-blur-xl border border-slate-700/50">
      <div className="relative">
        <Activity className="h-5 w-5 text-emerald-400" />
        <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
      </div>
      <span className="text-sm text-slate-300 font-medium">Next.js: Ready</span>
    </div>
    <div className="flex items-center space-x-3 bg-slate-800/60 px-6 py-3 rounded-full backdrop-blur-xl border border-slate-700/50">
      {serverHealth?.python_server?.status === 'healthy' ? (
        <>
          <div className="relative">
            <Activity className="h-5 w-5 text-emerald-400" />
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm text-slate-300 font-medium">Python AI: Ready</span>
        </>
      ) : (
        <>
          <div className="relative">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm text-red-400 font-medium">Python AI: Offline</span>
        </>
      )}
    </div>
  </div>
);

// Results Display Component
const ResultsDisplay = ({ prediction, error, loading }) => {
  const getSeverityColor = (className) => {
    const highSeverity = ['Burns', 'Diabetic Wounds', 'Laseration', 'Surgical Wounds', 'glioma', 'meningioma', 'pituitary'];
    const mediumSeverity = ['Cut', 'Pressure Wounds', 'Venous Wounds', 'Bruises'];
    
    if (highSeverity.includes(className)) return 'text-red-300 bg-red-900/30 border-red-500/40 shadow-red-500/20';
    if (mediumSeverity.includes(className)) return 'text-orange-300 bg-orange-900/30 border-orange-500/40 shadow-orange-500/20';
    if (className === 'Normal' || className === 'notumor') return 'text-emerald-300 bg-emerald-900/30 border-emerald-500/40 shadow-emerald-500/20';
    return 'text-cyan-300 bg-cyan-900/30 border-cyan-500/40 shadow-cyan-500/20';
  };

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/40 rounded-2xl p-6 mb-6 animate-fadeIn backdrop-blur-xl shadow-xl shadow-red-500/10">
        <div className="flex items-center">
          <div className="relative">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
            <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
          </div>
          <span className="text-red-300 font-semibold text-lg">Error</span>
        </div>
        <p className="text-red-400 mt-2">{error}</p>
      </div>
    );
  }

  if (prediction) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Main Prediction */}
        <div className={`rounded-2xl p-8 border-2 backdrop-blur-xl shadow-xl ${getSeverityColor(prediction.predicted_class)} transform hover:scale-[1.02] transition-all duration-500`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-2">{prediction.predicted_class}</h3>
              <p className="text-sm opacity-75">Primary Classification</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{prediction.confidence_percentage}</div>
              <p className="text-sm opacity-75">Confidence</p>
            </div>
          </div>
        </div>

        {/* 3D Human Body Visualization */}
        <HumanBody3D prediction={prediction} />

        {/* Top Predictions */}
        {prediction.top_predictions && (
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-semibold text-slate-200 mb-4 text-lg">Top Predictions</h4>
            <div className="space-y-3">
              {prediction.top_predictions.slice(0, 3).map((pred, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl backdrop-blur-xl hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-[1.02] border border-slate-700/50"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <span className="font-medium text-slate-200">{pred.class}</span>
                  <span className="text-slate-400 font-semibold">{(pred.confidence * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-6 animate-fadeIn backdrop-blur-xl shadow-xl shadow-amber-500/10" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-amber-400 mr-3 mt-1" />
            <div>
              <p className="text-amber-300 font-semibold text-lg">Medical Disclaimer</p>
              <p className="text-amber-400 text-sm mt-2">
                This AI analysis is for informational purposes only and should not replace professional medical diagnosis or treatment.
              </p>
            </div>
          </div>
        </div>

        <PrecautionButton prediction={prediction} />
      </div>
    );
  }

  if (!loading) {
    return (
      <div className="text-center py-16 animate-fadeIn">
        <div className="relative">
          <ImageIcon className="h-20 w-20 text-slate-600 mx-auto mb-6" />
          <div className="absolute inset-0 bg-slate-600/20 rounded-full blur-xl"></div>
        </div>
        <p className="text-slate-500 text-lg">Upload an image to see analysis results</p>
      </div>
    );
  }

  return <ThreeLoadingAnimation loading={loading} />;
};

// Supported Conditions Component
const SupportedConditions = () => {
  const conditions = [
    'Abrasions', 'Bruises', 'Burns', 'Cut', 'Diabetic Wounds',
    'Laceration', 'Normal', 'Pressure Wounds', 'Surgical Wounds',
    'Venous Wounds', 'Glioma', 'Meningioma', 'No Tumor', 'Pituitary'
  ];

  return (
    <div className="mt-16 bg-slate-900/40 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50 animate-fadeIn">
      <h3 className="text-2xl font-semibold mb-8 text-slate-200 flex items-center justify-center">
        <Brain className="h-6 w-6 mr-3 text-cyan-400" />
        Supported Medical Conditions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {conditions.map((condition, index) => (
          <div 
            key={condition} 
            className="bg-slate-800/50 px-4 py-3 rounded-xl text-sm text-center text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 cursor-pointer border border-slate-700/50 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/20"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {condition}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverHealth, setServerHealth] = useState(null);
  const fileInputRef = useRef(null);

  // Check server health on component mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('/api/predict');
      const result = await response.json();
      setServerHealth(result);
    } catch (err) {
      setServerHealth({ nextjs_status: 'healthy', python_server: { status: 'unreachable' } });
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    setPrediction(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const predictImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPrediction(result);
      } else {
        setError(result.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Failed to connect to prediction service');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Background */}
      <ThreeBackground />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Heart className="h-12 w-12 text-red-400 mr-4 animate-pulse" />
              <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Medical Image Classifier
            </h1>
          </div>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered analysis for medical images including wounds, burns, and brain scans
          </p>
          
          <ServerStatus serverHealth={serverHealth} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Upload Section */}
            <div className="bg-slate-900/40 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-semibold mb-8 text-slate-200 flex items-center">
                <Camera className="h-8 w-8 mr-3 text-cyan-400" />
                Upload Image
              </h2>
              
              <ImageUpload 
                onFileSelect={handleFileSelect}
                preview={preview}
                selectedFile={selectedFile}
                fileInputRef={fileInputRef}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={predictImage}
                  disabled={!selectedFile || loading}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-cyan-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center transform hover:scale-105 disabled:hover:scale-100 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin mr-3" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 mr-3" />
                      Analyze Image
                    </>
                  )}
                </button>
                
                <button
                  onClick={reset}
                  className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-500 transform hover:scale-105 font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-slate-900/40 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-slate-700/50 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-3xl font-semibold mb-8 text-slate-200 flex items-center">
                <CheckCircle className="h-8 w-8 mr-3 text-emerald-400" />
                Analysis Results
              </h2>
              
              <ResultsDisplay 
                prediction={prediction}
                error={error}
                loading={loading}
              />
            </div>
          </div>

          <SupportedConditions />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}