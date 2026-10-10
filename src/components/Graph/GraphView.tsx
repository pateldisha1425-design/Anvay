import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  TopicNode, 
  RelationshipEdge, 
  LearningStatus, 
  RelationshipType, 
  GraphFilterOptions 
} from '../../types/knowledge';
import { 
  Plus, 
  Minus, 
  Maximize2, 
  Crosshair, 
  Play, 
  Pause, 
  Filter, 
  RotateCcw,
  BookOpen,
  Search,
  X
} from 'lucide-react';

interface SimNode {
  id: string;
  topic: TopicNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  status: LearningStatus;
}

interface GraphViewProps {
  topics: TopicNode[];
  edges: RelationshipEdge[];
  statuses: Record<string, LearningStatus>;
  topicVisits?: Record<string, number>;
  missingPrerequisiteNodeIds?: Set<string>;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onOpenNote: (topicId: string) => void;
  filterOptions: GraphFilterOptions;
  onUpdateFilters: (filters: Partial<GraphFilterOptions>) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  topics,
  edges,
  statuses,
  topicVisits = {},
  missingPrerequisiteNodeIds,
  selectedTopicId,
  onSelectTopic,
  onOpenNote,
  filterOptions,
  onUpdateFilters,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera transform
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 0.95 });
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Dragging state
  const dragRef = useRef<{
    isDraggingCanvas: boolean;
    draggedNodeId: string | null;
    startX: number;
    startY: number;
    initialCamX: number;
    initialCamY: number;
  }>({
    isDraggingCanvas: false,
    draggedNodeId: null,
    startX: 0,
    startY: 0,
    initialCamX: 0,
    initialCamY: 0,
  });

  // Filter topics
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      if (filterOptions.selectedFolder !== 'all' && t.folderId !== filterOptions.selectedFolder) {
        return false;
      }
      const st = statuses[t.id] || 'not_studied';
      if (filterOptions.selectedStatus !== 'all' && st !== filterOptions.selectedStatus) {
        return false;
      }
      const query = (localSearch || filterOptions.searchQuery).trim().toLowerCase();
      if (query) {
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [topics, statuses, filterOptions, localSearch]);

  const activeTopicIds = useMemo(() => new Set(filteredTopics.map(t => t.id)), [filteredTopics]);

  const filteredEdges = useMemo(() => {
    return edges.filter(e => {
      if (!activeTopicIds.has(e.source) || !activeTopicIds.has(e.target)) {
        return false;
      }
      if (filterOptions.selectedRelationType !== 'all' && e.type !== filterOptions.selectedRelationType) {
        return false;
      }
      return true;
    });
  }, [edges, activeTopicIds, filterOptions]);

  // Simulation node storage
  const simNodesRef = useRef<Map<string, SimNode>>(new Map());

  // Initialize node positions
  useEffect(() => {
    const existingMap = simNodesRef.current;
    const newMap = new Map<string, SimNode>();
    const count = filteredTopics.length;
    const radiusDist = Math.max(180, count * 14);

    filteredTopics.forEach((topic, i) => {
      const existing = existingMap.get(topic.id);
      const angle = (i / Math.max(1, count)) * 2 * Math.PI;
      const status = statuses[topic.id] || 'not_studied';

      if (existing) {
        existing.topic = topic;
        existing.status = status;
        newMap.set(topic.id, existing);
      } else {
        newMap.set(topic.id, {
          id: topic.id,
          topic,
          x: Math.cos(angle) * (radiusDist + (Math.random() * 40 - 20)),
          y: Math.sin(angle) * (radiusDist + (Math.random() * 40 - 20)),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 5,
          status,
        });
      }
    });

    simNodesRef.current = newMap;
  }, [filteredTopics, statuses]);

  // Trace connected direct neighbours
  const directNeighbours = useMemo(() => {
    const targetId = hoveredNodeId || selectedTopicId;
    if (!targetId) return new Set<string>();

    const set = new Set<string>([targetId]);
    filteredEdges.forEach(e => {
      if (e.source === targetId) set.add(e.target);
      if (e.target === targetId) set.add(e.source);
    });
    return set;
  }, [hoveredNodeId, selectedTopicId, filteredEdges]);

  // Physics animation loop
  useEffect(() => {
    let animId: number;

    const runPhysics = () => {
      if (isPhysicsActive) {
        const nodes = Array.from(simNodesRef.current.values());
        const nodeMap = simNodesRef.current;

        // Repulsion
        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distSq = dx * dx + dy * dy + 0.1;
            const dist = Math.sqrt(distSq);

            if (dist < 260) {
              const force = (260 - dist) / (distSq * 0.06);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (dragRef.current.draggedNodeId !== n1.id) {
                n1.vx -= fx;
                n1.vy -= fy;
              }
              if (dragRef.current.draggedNodeId !== n2.id) {
                n2.vx += fx;
                n2.vy += fy;
              }
            }
          }
        }

        // Springs
        filteredEdges.forEach(edge => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return;

          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const idealDist = 95;
          const force = (dist - idealDist) * 0.04;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (dragRef.current.draggedNodeId !== s.id) {
            s.vx += fx;
            s.vy += fy;
          }
          if (dragRef.current.draggedNodeId !== t.id) {
            t.vx -= fx;
            t.vy -= fy;
          }
        });

        // Center gravity and damping
        nodes.forEach(n => {
          if (dragRef.current.draggedNodeId === n.id) {
            n.vx = 0;
            n.vy = 0;
            return;
          }

          n.vx -= n.x * 0.0008;
          n.vy -= n.y * 0.0008;

          n.vx *= 0.86;
          n.vy *= 0.86;

          n.x += n.vx;
          n.y += n.vy;
        });
      }

      drawCanvas();
      animId = requestAnimationFrame(runPhysics);
    };

    animId = requestAnimationFrame(runPhysics);
    return () => cancelAnimationFrame(animId);
  }, [isPhysicsActive, filteredEdges, camera, selectedTopicId, hoveredNodeId, directNeighbours]);

  // Obsidian restrained node colors
  const drawNodeStyle = useCallback((node: SimNode, isSelected: boolean, isNeighbour: boolean, isDimmed: boolean) => {
    if (isSelected) {
      return { fill: '#3b82f6', stroke: '#60a5fa', text: '#93c5fd' };
    }
    if (node.status === 'needs_revision') {
      return { fill: '#b45309', stroke: '#d97706', text: '#fde68a' };
    }
    if (node.status === 'learned') {
      return { fill: '#15803d', stroke: '#22c55e', text: '#86efac' };
    }
    if (isNeighbour) {
      return { fill: '#71717a', stroke: '#a1a1aa', text: '#e4e4e7' };
    }
    if (isDimmed) {
      return { fill: '#27272a', stroke: '#3f3f46', text: '#52525b' };
    }
    // Default muted grey
    return { fill: '#52525b', stroke: '#71717a', text: '#a1a1aa' };
  }, []);

  // Main canvas rendering
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Obsidian dark background (#161618)
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#161618';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + camera.x, height / 2 + camera.y);
    ctx.scale(camera.scale, camera.scale);

    const nodeMap = simNodesRef.current;
    const hasFocus = !!(selectedTopicId || hoveredNodeId);
    const activeTarget = hoveredNodeId || selectedTopicId;

    // 1. Draw Edges (subtle grey lines)
    filteredEdges.forEach(edge => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;

      const isConnectedToTarget = edge.source === activeTarget || edge.target === activeTarget;
      const isDimmed = hasFocus && !isConnectedToTarget;

      ctx.beginPath();
      if (isConnectedToTarget) {
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 1.2 / camera.scale;
      } else if (isDimmed) {
        ctx.strokeStyle = '#202024';
        ctx.lineWidth = 0.6 / camera.scale;
      } else {
        ctx.strokeStyle = '#2d2d32';
        ctx.lineWidth = 0.8 / camera.scale;
      }

      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    });

    // 2. Draw Nodes (small circular dots, no neon glow)
    const nodes = Array.from(nodeMap.values());
    nodes.forEach(node => {
      const isSelected = node.id === selectedTopicId;
      const isHovered = node.id === hoveredNodeId;
      const isNeighbour = directNeighbours.has(node.id);
      const isDimmed = hasFocus && !isNeighbour;

      const style = drawNodeStyle(node, isSelected, isNeighbour, isDimmed);
      const radius = isSelected ? 6.5 : isHovered ? 6 : node.radius;

      // Draw flat circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = style.fill;
      ctx.fill();

      ctx.lineWidth = (isSelected ? 1.5 : 1) / camera.scale;
      ctx.strokeStyle = style.stroke;
      ctx.stroke();

      // Prerequisite Gap Indicator Ring
      const isMissingPrereq = missingPrerequisiteNodeIds?.has(node.id) || (filterOptions.highlightMode === 'gaps' && (node.status !== 'learned'));
      if (isMissingPrereq && !isDimmed) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 2.8 / camera.scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2 / camera.scale;
        ctx.setLineDash([2 / camera.scale, 2 / camera.scale]);
        ctx.stroke();
        ctx.restore();
      }

      // Revision needed subtle marker dot
      if (node.status === 'needs_revision' && !isDimmed) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }

      // Draw text label
      const showLabel = camera.scale > 0.85 || isSelected || isHovered || isNeighbour;
      if (showLabel) {
        ctx.font = `${isSelected ? '500' : '400'} ${11 / camera.scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = style.text;
        ctx.fillText(node.topic.title, node.x + radius + 4, node.y);
      }
    });

    ctx.restore();
  }, [
    camera, 
    filteredEdges, 
    selectedTopicId, 
    hoveredNodeId, 
    directNeighbours, 
    drawNodeStyle
  ]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      drawCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawCanvas]);

  // Fit to screen
  const handleFitToScreen = useCallback(() => {
    const nodes = Array.from(simNodesRef.current.values());
    if (nodes.length === 0 || !canvasRef.current) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });

    const w = maxX - minX || 200;
    const h = maxY - minY || 200;
    const cW = canvasRef.current.width;
    const cH = canvasRef.current.height;

    const scale = Math.min(1.4, Math.max(0.4, Math.min((cW - 120) / w, (cH - 120) / h)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setCamera({
      scale,
      x: -centerX * scale,
      y: -centerY * scale,
    });
  }, []);

  // Center selected node
  const handleFocusSelected = useCallback(() => {
    if (!selectedTopicId) return;
    const node = simNodesRef.current.get(selectedTopicId);
    if (!node) return;

    setCamera(prev => ({
      ...prev,
      x: -node.x * prev.scale,
      y: -node.y * prev.scale,
    }));
  }, [selectedTopicId]);

  // Zoom helpers
  const handleZoom = (factor: number) => {
    setCamera(prev => ({
      ...prev,
      scale: Math.min(2.5, Math.max(0.25, prev.scale * factor)),
    }));
  };

  // Screen to world
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = screenX - rect.left - canvasRef.current.width / 2 - camera.x;
    const y = screenY - rect.top - canvasRef.current.height / 2 - camera.y;
    return {
      x: x / camera.scale,
      y: y / camera.scale,
    };
  }, [camera]);

  const findNodeAtPos = useCallback((worldX: number, worldY: number) => {
    const nodes = Array.from(simNodesRef.current.values());
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= n.radius + 6) {
        return n;
      }
    }
    return null;
  }, []);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPos(worldPos.x, worldPos.y);

    if (hitNode) {
      dragRef.current = {
        isDraggingCanvas: false,
        draggedNodeId: hitNode.id,
        startX: e.clientX,
        startY: e.clientY,
        initialCamX: camera.x,
        initialCamY: camera.y,
      };
      onSelectTopic(hitNode.id);
    } else {
      dragRef.current = {
        isDraggingCanvas: true,
        draggedNodeId: null,
        startX: e.clientX,
        startY: e.clientY,
        initialCamX: camera.x,
        initialCamY: camera.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);

    if (!dragRef.current.isDraggingCanvas && !dragRef.current.draggedNodeId) {
      const hitNode = findNodeAtPos(worldPos.x, worldPos.y);
      setHoveredNodeId(hitNode ? hitNode.id : null);
    }

    if (dragRef.current.draggedNodeId) {
      const node = simNodesRef.current.get(dragRef.current.draggedNodeId);
      if (node) {
        node.x = worldPos.x;
        node.y = worldPos.y;
        node.vx = 0;
        node.vy = 0;
      }
      return;
    }

    if (dragRef.current.isDraggingCanvas) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setCamera(prev => ({
        ...prev,
        x: dragRef.current.initialCamX + dx,
        y: dragRef.current.initialCamY + dy,
      }));
    }
  };

  const handleMouseUp = () => {
    dragRef.current.isDraggingCanvas = false;
    dragRef.current.draggedNodeId = null;
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPos(worldPos.x, worldPos.y);
    if (hitNode) {
      onSelectTopic(hitNode.id);
      onOpenNote(hitNode.id);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    setCamera(prev => ({
      ...prev,
      scale: Math.min(2.5, Math.max(0.25, prev.scale * factor)),
    }));
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#161618] overflow-hidden select-none">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Search & Filter Bar (Obsidian graph controls style) */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-[#1a1a1d]/90 border border-[#2b2b30] rounded-md px-2 py-1 text-xs">
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter graph..."
          className="bg-transparent text-zinc-200 text-[11px] placeholder-zinc-500 focus:outline-none w-28 sm:w-40"
        />
        {localSearch && (
          <button onClick={() => setLocalSearch('')} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-3 h-3" />
          </button>
        )}
        <div className="w-px h-3.5 bg-[#2b2b30] mx-1" />
        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`p-1 rounded text-xs transition-colors ${
            showFilterDrawer ? 'text-blue-400 bg-[#25252b]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Graph settings and filters"
        >
          <Filter className="w-3 h-3" />
        </button>
      </div>

      {/* Unobtrusive Bottom-Right Compact Graph Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-1 bg-[#1a1a1d]/90 border border-[#2b2b30] rounded-md p-1 shadow-xs">
        <button
          onClick={() => handleZoom(1.15)}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors"
          title="Zoom in"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom(0.85)}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors"
          title="Zoom out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors"
          title="Fit graph to screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        {selectedTopicId && (
          <button
            onClick={handleFocusSelected}
            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-[#25252b] rounded transition-colors"
            title="Center on selected node"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="w-px h-3 bg-[#2b2b30]" />
        <button
          onClick={() => setIsPhysicsActive(!isPhysicsActive)}
          className={`p-1.5 rounded transition-colors ${
            isPhysicsActive ? 'text-zinc-400 hover:text-zinc-200' : 'text-blue-400'
          }`}
          title={isPhysicsActive ? 'Pause simulation forces' : 'Resume simulation forces'}
        >
          {isPhysicsActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Selected Node Quick Open Bar (Bottom Left) */}
      {selectedTopic && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-2 bg-[#1a1a1d]/95 border border-[#2b2b30] rounded-md px-2.5 py-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-medium text-zinc-200 text-[11px] truncate max-w-[200px]">
            {selectedTopic.title}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {topicVisits[selectedTopic.id] || 0} visits
          </span>
          <button
            onClick={() => onOpenNote(selectedTopic.id)}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 ml-1.5 hover:underline"
          >
            <BookOpen className="w-3 h-3" />
            Open note
          </button>
        </div>
      )}

      {/* Filter Popover */}
      {showFilterDrawer && (
        <div className="absolute top-12 left-3 z-20 w-64 bg-[#1a1a1d] border border-[#2b2b30] rounded-md p-3 shadow-xl text-[11px] text-zinc-300 space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#26262a] pb-1.5">
            <span className="font-semibold text-zinc-200">Filters</span>
            <button
              onClick={() => {
                onUpdateFilters({
                  selectedFolder: 'all',
                  selectedStatus: 'all',
                  selectedRelationType: 'all',
                  searchQuery: '',
                });
                setLocalSearch('');
              }}
              className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="block text-zinc-500 mb-1">Folder:</label>
            <select
              value={filterOptions.selectedFolder}
              onChange={(e) => onUpdateFilters({ selectedFolder: e.target.value })}
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
            >
              <option value="all">All Folders</option>
              <option value="01-oxides">01 Oxides</option>
              <option value="02-polymers">02 Polymers</option>
              <option value="03-conducting-polymers">03 Conducting Polymers</option>
              <option value="04-nanomaterials">04 Nanotechnology</option>
              <option value="05-synthesis-nanomaterials">05 Synthesis</option>
              <option value="06-oleds">06 OLEDs</option>
              <option value="personal">Personal Notes</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 mb-1">Learning status:</label>
            <select
              value={filterOptions.selectedStatus}
              onChange={(e) => onUpdateFilters({ selectedStatus: e.target.value as any })}
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="not_studied">Not studied</option>
              <option value="learning">Learning</option>
              <option value="needs_revision">Needs revision</option>
              <option value="learned">Learned</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 mb-1">Relationship type:</label>
            <select
              value={filterOptions.selectedRelationType}
              onChange={(e) => onUpdateFilters({ selectedRelationType: e.target.value as any })}
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="prerequisite">Prerequisites</option>
              <option value="part_of">Part of</option>
              <option value="preparation_of">Preparation</option>
              <option value="application_of">Applications</option>
              <option value="related">Related</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 mb-1">Highlight mode:</label>
            <select
              value={filterOptions.highlightMode}
              onChange={(e) => onUpdateFilters({ highlightMode: e.target.value as any })}
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
            >
              <option value="all">All Connected</option>
              <option value="immediate">Immediate Neighbors</option>
              <option value="prerequisites">Prerequisites Only</option>
              <option value="gaps">⚠️ Prerequisite Gaps</option>
              <option value="isolated">Isolated Nodes</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
