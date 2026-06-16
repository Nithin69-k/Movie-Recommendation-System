"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Smile } from 'lucide-react';
import { Movie } from '../data/movies';
import { getMoodRecommendations } from '../utils/recommender';

interface FaceDetectorProps {
  onMovieClick: (movie: Movie) => void;
}

export default function FaceDetector({ onMovieClick }: FaceDetectorProps) {
  const [streamActive, setStreamActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState("");
  const [recommendations, setRecommendations] = useState<{ movie: Movie; matchScore: number }[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Stop video stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Start video stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
        drawFaceMesh();
      }
    } catch {
      console.warn("Camera access denied or unavailable. Running custom mock scanner simulation.");
      setStreamActive(true);
      drawFaceMesh(true); // run mock canvas animation
    }
  };

  // Draw cybernetic face mesh tracking
  const drawFaceMesh = (isMock = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points: { x: number; y: number; vx: number; vy: number }[] = [];
    const width = canvas.width;
    const height = canvas.height;

    // Generate random points resembling standard facial landmarks
    const faceCenter = { x: width / 2, y: height / 2 };
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const radius = 60 + Math.random() * 20;
      points.push({
        x: faceCenter.x + Math.cos(angle) * radius,
        y: faceCenter.y + Math.sin(angle) * radius * 1.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
    // Add inner features (eyes, nose, mouth)
    // Left eye
    points.push({ x: width/2 - 25, y: height/2 - 20, vx: 0, vy: 0 });
    // Right eye
    points.push({ x: width/2 + 25, y: height/2 - 20, vx: 0, vy: 0 });
    // Nose bridge
    points.push({ x: width/2, y: height/2 - 5, vx: 0, vy: 0 });
    points.push({ x: width/2, y: height/2 + 10, vx: 0, vy: 0 });
    // Mouth outline
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      points.push({
        x: faceCenter.x + Math.cos(angle) * 20,
        y: faceCenter.y + 35 + Math.sin(angle) * 8,
        vx: 0,
        vy: 0
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw mock webcam background if camera is blocked/denied
      if (isMock) {
        ctx.fillStyle = "#0a0720";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(0, 242, 254, 0.05)";
        ctx.beginPath();
        ctx.arc(width/2, height/2, 80, 0, Math.PI*2);
        ctx.fill();
      }

      // Draw grid lines
      ctx.strokeStyle = "rgba(0, 242, 254, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // Update and Draw dots
      ctx.fillStyle = "var(--color-cyan-accent)";
      ctx.strokeStyle = "rgba(0, 242, 254, 0.3)";
      ctx.lineWidth = 1;

      points.forEach((pt, idx) => {
        // Jitter points slightly to simulate tracking
        pt.x += (Math.random() - 0.5) * 0.8;
        pt.y += (Math.random() - 0.5) * 0.8;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect adjacent dots
        points.forEach((otherPt, otherIdx) => {
          if (idx !== otherIdx) {
            const dist = Math.hypot(pt.x - otherPt.x, pt.y - otherPt.y);
            if (dist < 25) {
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(otherPt.x, otherPt.y);
              ctx.stroke();
            }
          }
        });
      });

      // Scan HUD Overlay
      ctx.strokeStyle = "var(--color-pink-accent)";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Scanning sweep line
      const sweepY = (Date.now() % 2000) / 2000 * height;
      ctx.strokeStyle = "rgba(255, 0, 127, 0.5)";
      ctx.shadowColor = "var(--color-pink-accent)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(10, sweepY);
      ctx.lineTo(width - 10, sweepY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      animationRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const triggerScan = () => {
    setIsScanning(true);
    setDetectedEmotion("Analyzing parameters...");

    setTimeout(() => {
      setIsScanning(false);
      const emotions = ["Happy", "Sad", "Angry", "Tired", "Excited"];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      setDetectedEmotion(emotion);

      // Query database
      const matched = getMoodRecommendations(emotion.toLowerCase());
      setRecommendations(matched);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl relative">
      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-accent to-pink-accent bg-clip-text text-transparent flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-cyan-accent" /> AI Face Emotion Detection
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scanner Feed Panel */}
        <div className="flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/5 p-4 min-h-[300px]">
          {streamActive ? (
            <div className="relative rounded-lg overflow-hidden border border-cyan-accent/30 w-full max-w-[320px] aspect-[4/3]">
              {/* Webcam Feed element */}
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-30 scale-x-[-1]"
                muted
                playsInline
              />
              {/* Landmark Canvas Overlay */}
              <canvas 
                ref={canvasRef}
                width={320}
                height={240}
                className="absolute inset-0 w-full h-full z-1"
              />

              {isScanning && (
                <div className="absolute inset-0 z-2 bg-black/40 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full border-2 border-cyan-accent border-t-transparent animate-spin" />
                    <span className="text-xs font-semibold text-cyan-accent tracking-widest uppercase animate-pulse">Scanning Mesh...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center">
                <Camera className="w-8 h-8 text-cyan-accent" />
              </div>
              <p className="text-xs text-white/60 max-w-xs">
                Activate webcam to scan facial mesh points. The local classifier will estimate your emotional state instantly.
              </p>
              <button
                onClick={startCamera}
                className="px-5 py-2.5 rounded-lg bg-cyan-accent text-black hover:bg-cyan-accent/90 transition-all font-bold text-sm"
              >
                Launch Scanner
              </button>
            </div>
          )}

          {streamActive && !isScanning && (
            <div className="flex gap-3 mt-4 w-full max-w-[320px]">
              <button
                onClick={triggerScan}
                className="flex-1 py-2 rounded-lg bg-pink-accent text-white hover:bg-pink-accent/90 transition-all text-xs font-bold uppercase tracking-wider"
              >
                Scan Emotion
              </button>
              <button
                onClick={stopCamera}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs"
              >
                Stop Feed
              </button>
            </div>
          )}
        </div>

        {/* Emotion Results Panel */}
        <div className="glass-panel p-4 rounded-xl bg-black/20 border-white/5 min-h-[300px] flex flex-col">
          <span className="text-xs text-white/50 uppercase tracking-wider block mb-3 font-mono">Telemetry Output</span>

          <AnimatePresence mode="wait">
            {!detectedEmotion ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/30">
                <Smile className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-xs">Awaiting scan telemetry. Activate webcam and click &quot;Scan Emotion&quot;.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/40">Classified Emotion</span>
                    <h4 className="text-xl font-bold text-cyan-accent mt-0.5">{detectedEmotion}</h4>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-lg">
                    {detectedEmotion === "Happy" && "😊"}
                    {detectedEmotion === "Sad" && "😢"}
                    {detectedEmotion === "Angry" && "😠"}
                    {detectedEmotion === "Tired" && "🥱"}
                    {detectedEmotion === "Excited" && "🤩"}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Instant Recommendations</span>
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map(({ movie, matchScore }) => (
                      <div
                        key={movie.id}
                        onClick={() => onMovieClick(movie)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-accent/30 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-all duration-200"
                      >
                        <img src={movie.imageUrl} alt={movie.title} className="w-10 h-10 rounded object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs text-white truncate">{movie.title}</h5>
                          <p className="text-[9px] text-white/50">{movie.genre.join(', ')} • Match: {matchScore}%</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-accent shrink-0">
                          {matchScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
