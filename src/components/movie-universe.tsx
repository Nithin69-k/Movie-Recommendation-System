"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Network, Info } from 'lucide-react';
import { Movie, movies } from '../data/movies';

interface Node {
  id: string;
  label: string;
  type: 'movie' | 'actor' | 'director' | 'genre';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  refId?: string; // If movie, the movie id
}

interface Link {
  source: string; // Node ID
  target: string; // Node ID
}

// Color schemes configuration
const colors = {
  movie: '#6366F1', // Primary Indigo
  actor: '#8B5CF6', // Accent Violet
  director: '#10B981', // Success Emerald
  genre: '#F59E0B' // Warning Amber
};

export default function MovieUniverse({ onMovieClick }: { onMovieClick: (movie: Movie) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States only for items shown in HTML layout overlays
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Refs for animation parameters to prevent React immutability/cascading render warnings
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  
  const isPanningRef = useRef(false);
  const draggedNodeRef = useRef<Node | null>(null);
  
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (parent && canvas) {
        canvas.width = parent.clientWidth;
        canvas.height = 450;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Build Nodes and Links once
    const nodeList: Node[] = [];
    const linkList: Link[] = [];
    const nodeIds = new Set<string>();

    const addNode = (id: string, label: string, type: 'movie' | 'actor' | 'director' | 'genre', refId?: string) => {
      const key = `${type}:${id}`;
      if (!nodeIds.has(key)) {
        nodeIds.add(key);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        nodeList.push({
          id: key,
          label,
          type,
          x: centerX + (Math.random() - 0.5) * 300,
          y: centerY + (Math.random() - 0.5) * 200,
          vx: 0,
          vy: 0,
          radius: type === 'movie' ? 12 : type === 'director' ? 9 : 7,
          color: colors[type],
          refId
        });
      }
    };

    const addLink = (sourceId: string, sourceType: string, targetId: string, targetType: string) => {
      const source = `${sourceType}:${sourceId}`;
      const target = `${targetType}:${targetId}`;
      linkList.push({ source, target });
    };

    // Load only a subset (e.g. 7 movies) to keep the graph readable and responsive
    movies.slice(0, 7).forEach(movie => {
      addNode(movie.id, movie.title, 'movie', movie.id);
      
      // Add director
      addNode(movie.director, movie.director, 'director');
      addLink(movie.id, 'movie', movie.director, 'director');

      // Add main actors (first 2)
      movie.cast.slice(0, 2).forEach(actor => {
        addNode(actor, actor, 'actor');
        addLink(movie.id, 'movie', actor, 'actor');
      });

      // Add genres
      movie.genre.slice(0, 2).forEach(g => {
        addNode(g, g, 'genre');
        addLink(movie.id, 'movie', g, 'genre');
      });
    });

    nodesRef.current = nodeList;
    linksRef.current = linkList;

    let animationId: number;

    // Force-directed simulation loop
    const runSimulation = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Parameters for force equations
      const k = 0.03; // spring force coefficient
      const repForce = 800; // electrostatic repulsion strength
      const dampening = 0.85; // drag/air resistance
      const centerForce = 0.01;

      // 1. Repulsion force between all nodes (Coulomb's Law)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.hypot(dx, dy) || 1;

          if (dist < 280) {
            const force = repForce / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (nodeA !== draggedNodeRef.current) {
              nodeA.vx -= fx;
              nodeA.vy -= fy;
            }
            if (nodeB !== draggedNodeRef.current) {
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }
      }

      // 2. Spring forces along links (Hooke's Law)
      links.forEach(link => {
        const nodeA = nodes.find(n => n.id === link.source);
        const nodeB = nodes.find(n => n.id === link.target);
        if (!nodeA || !nodeB) return;

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.hypot(dx, dy) || 1;
        const restLen = 120; // desired connection distance
        
        const force = (dist - restLen) * k;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (nodeA !== draggedNodeRef.current) {
          nodeA.vx += fx;
          nodeA.vy += fy;
        }
        if (nodeB !== draggedNodeRef.current) {
          nodeB.vx -= fx;
          nodeB.vy -= fy;
        }
      });

      // 3. Gravity pulling nodes toward the canvas center
      const centerX = width / 2;
      const centerY = height / 2;
      nodes.forEach(node => {
        if (node === draggedNodeRef.current) return;
        node.vx += (centerX - node.x) * centerForce;
        node.vy += (centerY - node.y) * centerForce;

        // Apply friction/air dampening
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= dampening;
        node.vy *= dampening;
      });

      // --- RENDERING ---
      ctx.clearRect(0, 0, width, height);

      // Render grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      ctx.save();
      // Apply panning and zooming
      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(zoomRef.current, zoomRef.current);

      // Draw lines/links
      nodes.forEach(node => {
        links.forEach(link => {
          if (link.source === node.id || link.target === node.id) {
            const targetNode = nodes.find(n => n.id === (link.source === node.id ? link.target : link.source));
            if (!targetNode) return;

            // Highlight connections if hovered
            const isHighlighted = hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === targetNode.id);
            
            ctx.strokeStyle = isHighlighted ? 'rgba(0, 242, 254, 0.5)' : 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = isHighlighted ? 2.0 : 0.8;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isSelected = selectedNode && selectedNode.id === node.id;

        if (isHovered || isSelected) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = node.color;
        }

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isHovered ? 2 : 0), 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // reset shadow

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.stroke();

        const labelText = node.label;
        ctx.fillStyle = (isHovered || isSelected) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
        ctx.font = `${isHovered ? 'bold 11px' : '9px'} Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(labelText, node.x, node.y + node.radius + 12);
      });

      ctx.restore();
      animationId = requestAnimationFrame(runSimulation);
    };

    runSimulation();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hoveredNode, selectedNode]);

  // Handle canvas mouse operations
  const getTransformedCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - panRef.current.x) / zoomRef.current;
    const y = (clientY - rect.top - panRef.current.y) / zoomRef.current;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getTransformedCoords(e.clientX, e.clientY);
    const clickedNode = nodesRef.current.find(n => Math.hypot(n.x - coords.x, n.y - coords.y) <= n.radius + 5);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      setSelectedNode(clickedNode);
      dragStart.current = { x: coords.x - clickedNode.x, y: coords.y - clickedNode.y };
      
      if (clickedNode.type === 'movie' && clickedNode.refId) {
        const found = movies.find(m => m.id === clickedNode.refId);
        if (found) onMovieClick(found);
      }
    } else {
      isPanningRef.current = true;
      dragStart.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanningRef.current) {
      panRef.current = {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      };
    } else if (draggedNodeRef.current) {
      const coords = getTransformedCoords(e.clientX, e.clientY);
      draggedNodeRef.current.x = coords.x - dragStart.current.x;
      draggedNodeRef.current.y = coords.y - dragStart.current.y;
    } else {
      const coords = getTransformedCoords(e.clientX, e.clientY);
      const hovered = nodesRef.current.find(n => Math.hypot(n.x - coords.x, n.y - coords.y) <= n.radius + 5);
      setHoveredNode(hovered || null);
    }
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
    draggedNodeRef.current = null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative" ref={containerRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-accent to-pink-accent bg-clip-text text-transparent flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-accent" /> Interactive Movie Universe
          </h3>
          <p className="text-xs text-white/50 mt-0.5">Explore connections between movies, actors, directors, and genres. Click any movie node to inspect.</p>
        </div>
        
        {/* Node Legends */}
        <div className="flex flex-wrap gap-3 text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-accent" />
            <span>Movie</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-accent" />
            <span>Cast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Director</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>Genre</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/60 cursor-grab active:cursor-grabbing">
        <canvas 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="block w-full h-[400px]"
        />

        <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-[10px] text-white/50 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-accent" /> Pan with mouse click. Click node to inspect details.
        </div>
      </div>
    </div>
  );
}
