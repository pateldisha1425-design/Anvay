import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  TopicNode, 
  RelationshipEdge, 
  LearningStatus, 
  GraphFilterOptions 
} from '../../types/knowledge';
import { 
  Plus, 
  Minus, 
  Maximize2, 
  Crosshair, 
  Play, 
  Pause, 
  SlidersHorizontal, 
  RotateCcw,
  BookOpen,
  Search,
  X,
  Compass,
  Eye,
  Activity,
  Layers,
  ArrowRight,
  List,
  CheckCircle2,
  ChevronRight,
  Folder,
  Network
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

interface GraphSettings {
  nodeSize: number;
  linkThickness: number;
  linkDistance: number;
  repulsion: number;
  linkStrength: number;
  centerForce: number;
  showLabels: boolean;
  fadeLabelsOnZoom: boolean;
  showArrows: boolean;
  colorGroupBy: 'none' | 'folder' | 'status' | 'category';
}

const DEFAULT_SETTINGS: GraphSettings = {
  nodeSize: 4.5,
  linkThickness: 0.9,
  linkDistance: 85,
  repulsion: 180,
  linkStrength: 0.035,
  centerForce: 0.0006,
  showLabels: true,
  fadeLabelsOnZoom: true,
  showArrows: false,
  colorGroupBy: 'folder',
};

const SETTINGS_STORAGE_KEY = 'anvay_obsidian_graph_settings';

function loadStoredSettings(): GraphSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

function saveStoredSettings(settings: GraphSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    // ignore
  }
}

const FOLDER_COLORS: Record<string, string> = {
  '01-oxides': '#38bdf8',               // Sky
  '02-polymers': '#a78bfa',             // Soft Purple
  '03-conducting-polymers': '#ec4899',  // Rose pink
  '04-nanomaterials': '#34d399',        // Emerald
  '05-synthesis-nanomaterials': '#fb923c', // Amber orange
  '06-oleds': '#818cf8',                // Indigo
  'personal': '#94a3b8',                // Slate
  'unsorted': '#a1a1aa',                // Zinc
};

const FOLDER_LABELS: Record<string, string> = {
  '01-oxides': '01 Oxides',
  '02-polymers': '02 Polymers',
  '03-conducting-polymers': '03 Conducting Polymers',
  '04-nanomaterials': '04 Nanotechnology and Nanomaterials',
  '05-synthesis-nanomaterials': '05 Synthesis of Nanomaterials',
  '06-oleds': '06 OLEDs',
  'personal': 'Personal Notes',
  'unsorted': 'Unsorted Notes',
};

const STATUS_COLORS: Record<LearningStatus, string> = {
  'learned': '#22c55e',        // Calm green
  'learning': '#3b82f6',       // Blue
  'needs_revision': '#f59e0b', // Amber
  'not_studied': '#64748b',    // Muted slate
};

const CATEGORY_COLORS: Record<string, string> = {
  'Electronic Ceramics': '#38bdf8',
  'Magnetic Materials': '#818cf8',
  'Optical Ceramics': '#a78bfa',
  'Conducting Polymers': '#ec4899',
  'High-Performance Polymers': '#f472b6',
  'Nanomaterials & Synthesis': '#34d399',
  'OLEDs & Displays': '#fb923c',
  'Sensors & Devices': '#2dd4bf',
};

const NODE_POSITIONS_STORAGE_KEY = 'anvay_obsidian_graph_node_positions';
const CAMERA_STORAGE_KEY = 'anvay_obsidian_graph_camera';

function loadStoredNodePositions(): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  try {
    const raw = localStorage.getItem(NODE_POSITIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      for (const [id, pos] of Object.entries(parsed)) {
        if (pos && typeof (pos as any).x === 'number' && typeof (pos as any).y === 'number') {
          map.set(id, pos as { x: number; y: number });
        }
      }
    }
  } catch (e) {
    // fallback
  }
  return map;
}

let savePositionsTimer: ReturnType<typeof setTimeout> | null = null;
function saveStoredNodePositions(map: Map<string, { x: number; y: number }>): void {
  if (savePositionsTimer) clearTimeout(savePositionsTimer);
  savePositionsTimer = setTimeout(() => {
    try {
      const obj: Record<string, { x: number; y: number }> = {};
      map.forEach((val, key) => {
        obj[key] = { x: Math.round(val.x * 10) / 10, y: Math.round(val.y * 10) / 10 };
      });
      localStorage.setItem(NODE_POSITIONS_STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      // ignore
    }
  }, 250);
}

function loadStoredCamera(): { x: number; y: number; scale: number; hasCustomView: boolean } {
  try {
    const raw = localStorage.getItem(CAMERA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number' && typeof parsed.scale === 'number') {
        return { x: parsed.x, y: parsed.y, scale: parsed.scale, hasCustomView: true };
      }
    }
  } catch (e) {
    // fallback
  }
  return { x: 0, y: 0, scale: 0.95, hasCustomView: false };
}

function saveStoredCamera(cam: { x: number; y: number; scale: number }): void {
  try {
    localStorage.setItem(CAMERA_STORAGE_KEY, JSON.stringify({
      x: Math.round(cam.x * 10) / 10,
      y: Math.round(cam.y * 10) / 10,
      scale: Math.round(cam.scale * 1000) / 1000
    }));
  } catch (e) {
    // ignore
  }
}

// Global coordinates & camera persistence so tab switching and reloads preserve the knowledge map
const globalNodePositionCache = loadStoredNodePositions();
let globalCameraCache = loadStoredCamera();

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
  isActive?: boolean;
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
  isActive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Settings
  const [settings, setSettings] = useState<GraphSettings>(() => loadStoredSettings());
  const [activeSettingsTab, setActiveSettingsTab] = useState<'filters' | 'groups' | 'display' | 'forces'>('filters');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const updateSetting = useCallback(<K extends keyof GraphSettings>(key: K, val: GraphSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: val };
      saveStoredSettings(next);
      return next;
    });
  }, []);

  // Camera refs initialized from persistent cache for high-framerate silky smooth transitions
  const cameraRef = useRef({
    x: globalCameraCache.x,
    y: globalCameraCache.y,
    scale: globalCameraCache.scale,
  });
  const targetCameraRef = useRef({
    x: globalCameraCache.x,
    y: globalCameraCache.y,
    scale: globalCameraCache.scale,
  });

  // Interaction states
  const [viewFormat, setViewFormat] = useState<'canvas' | 'list'>('canvas');
  const [isPhysicsPausedByUser, setIsPhysicsPausedByUser] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  // Mode: Global vs Local Graph
  const graphMode = filterOptions.graphMode || 'global';
  const localDepth = filterOptions.localDepth || 1;

  // Simulation alpha (energy) and sleep refs: if cached, settle gently without floating
  const alphaRef = useRef<number>(globalNodePositionCache.size > 0 ? 0.03 : 0.85);
  const isSleepingRef = useRef<boolean>(false);
  const animFrameIdRef = useRef<number | null>(null);
  const renderRequestedRef = useRef<boolean>(false);

  // Dragging and touch state
  const dragRef = useRef<{
    isDraggingCanvas: boolean;
    draggedNodeId: string | null;
    startX: number;
    startY: number;
    initialCamX: number;
    initialCamY: number;
    hasMoved: boolean;
    dragOffsetX: number;
    dragOffsetY: number;
  }>({
    isDraggingCanvas: false,
    draggedNodeId: null,
    startX: 0,
    startY: 0,
    initialCamX: 0,
    initialCamY: 0,
    hasMoved: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
  });

  const touchStateRef = useRef<{
    initialDist: number;
    initialScale: number;
    lastTouchX: number;
    lastTouchY: number;
    isMultiTouch: boolean;
  }>({
    initialDist: 0,
    initialScale: 1,
    lastTouchX: 0,
    lastTouchY: 0,
    isMultiTouch: false,
  });

  // 1. Build adjacency map across all edges for fast lookup & BFS
  const fullAdjacencyMap = useMemo(() => {
    const map = new Map<string, { incoming: string[]; outgoing: string[]; all: Set<string> }>();
    topics.forEach(t => {
      map.set(t.id, { incoming: [], outgoing: [], all: new Set<string>() });
    });
    edges.forEach(e => {
      const s = map.get(e.source);
      const t = map.get(e.target);
      if (s) {
        s.outgoing.push(e.target);
        s.all.add(e.target);
      }
      if (t) {
        t.incoming.push(e.source);
        t.all.add(e.source);
      }
    });
    return map;
  }, [topics, edges]);

  // 2. Identify active focus topic for Local Graph
  const localFocusTopicId = useMemo(() => {
    if (selectedTopicId && topics.some(t => t.id === selectedTopicId)) {
      return selectedTopicId;
    }
    return topics.length > 0 ? topics[0].id : null;
  }, [selectedTopicId, topics]);

  // 3. Compute Local Graph Node Set (BFS traversal up to localDepth)
  const localGraphNodeIds = useMemo(() => {
    if (graphMode !== 'local' || !localFocusTopicId) return null;

    const visited = new Set<string>([localFocusTopicId]);
    let currentLevel = [localFocusTopicId];

    for (let depth = 0; depth < localDepth; depth++) {
      const nextLevel: string[] = [];
      currentLevel.forEach(nodeId => {
        const adj = fullAdjacencyMap.get(nodeId);
        if (adj) {
          adj.all.forEach(neighborId => {
            if (!visited.has(neighborId)) {
              visited.add(neighborId);
              nextLevel.push(neighborId);
            }
          });
        }
      });
      currentLevel = nextLevel;
    }

    return visited;
  }, [graphMode, localFocusTopicId, localDepth, fullAdjacencyMap]);

  // 4. Topic Filtering (Search, Folder, Status, Orphans, Local Graph)
  const filteredTopics = useMemo(() => {
    const query = (localSearch || filterOptions.searchQuery).trim().toLowerCase();
    const hideOrphans = !!filterOptions.hideOrphans;

    return topics.filter(t => {
      // Local graph isolation
      if (localGraphNodeIds && !localGraphNodeIds.has(t.id)) {
        return false;
      }

      // Folder filter (supports functional-materials parent folder and specific chapters)
      if (filterOptions.selectedFolder !== 'all') {
        if (filterOptions.selectedFolder === 'functional-materials') {
          const fmChildFolderIds = ['01-oxides', '02-polymers', '03-conducting-polymers', '04-nanomaterials', '05-synthesis-nanomaterials', '06-oleds', 'functional-materials'];
          if (!fmChildFolderIds.includes(t.folderId)) {
            return false;
          }
        } else if (t.folderId !== filterOptions.selectedFolder) {
          return false;
        }
      }

      // Learning status filter
      const st = statuses[t.id] || 'not_studied';
      if (filterOptions.selectedStatus !== 'all' && st !== filterOptions.selectedStatus) {
        return false;
      }

      // Search filter
      if (query) {
        const matchTitle = t.title.toLowerCase().includes(query);
        const matchDesc = t.description?.toLowerCase().includes(query);
        const matchCategory = t.category?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCategory) return false;
      }

      // Hide orphans filter
      if (hideOrphans) {
        const adj = fullAdjacencyMap.get(t.id);
        const connectionCount = adj ? adj.all.size : 0;
        if (connectionCount === 0) return false;
      }

      return true;
    });
  }, [topics, statuses, filterOptions, localSearch, localGraphNodeIds, fullAdjacencyMap]);

  const activeTopicIds = useMemo(() => new Set(filteredTopics.map(t => t.id)), [filteredTopics]);

  // Grouped topics for alternative List view navigation
  const groupedTopics = useMemo(() => {
    const map: Record<string, TopicNode[]> = {};
    filteredTopics.forEach(t => {
      const fId = t.folderId || 'unsorted';
      if (!map[fId]) map[fId] = [];
      map[fId].push(t);
    });
    return map;
  }, [filteredTopics]);

  // 5. Filtered Edges
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
  }, [edges, activeTopicIds, filterOptions.selectedRelationType]);

  // 6. Active Adjacency Map for rendering & hover highlight
  const activeAdjacencyMap = useMemo(() => {
    const map = new Map<string, { incoming: string[]; outgoing: string[]; all: Set<string> }>();
    activeTopicIds.forEach(id => {
      map.set(id, { incoming: [], outgoing: [], all: new Set<string>() });
    });
    filteredEdges.forEach(e => {
      const s = map.get(e.source);
      const t = map.get(e.target);
      if (s) {
        s.outgoing.push(e.target);
        s.all.add(e.target);
      }
      if (t) {
        t.incoming.push(e.source);
        t.all.add(e.source);
      }
    });
    return map;
  }, [activeTopicIds, filteredEdges]);

  // Simulation Node Map & runner refs
  const simNodesRef = useRef<Map<string, SimNode>>(new Map());
  const tickRef = useRef<() => void>(() => {});
  const isCancelledRef = useRef<boolean>(false);

  const runSimulationFrame = useCallback(() => {
    if (isCancelledRef.current) return;
    tickRef.current();
  }, []);

  const startSimulation = useCallback(() => {
    if (isPhysicsPausedByUser) return;
    if (animFrameIdRef.current !== null) return;
    animFrameIdRef.current = requestAnimationFrame(runSimulationFrame);
  }, [isPhysicsPausedByUser, runSimulationFrame]);

  // Wake up physics engine smoothly and restart continuous simulation loop
  const wakeSimulation = useCallback((alpha = 0.25) => {
    alphaRef.current = Math.max(alphaRef.current, alpha);
    isSleepingRef.current = false;
    startSimulation();
  }, [startSimulation]);

  // Initialize and update simulation node positions without scrambling existing ones
  useEffect(() => {
    const existingMap = simNodesRef.current;
    const newMap = new Map<string, SimNode>();
    const count = filteredTopics.length;
    const radiusDist = Math.max(140, Math.min(320, count * 9));

    let addedNewNodes = false;

    filteredTopics.forEach((topic, i) => {
      const status = statuses[topic.id] || 'not_studied';
      const existing = existingMap.get(topic.id);
      const cached = globalNodePositionCache.get(topic.id);

      if (existing) {
        existing.topic = topic;
        existing.status = status;
        newMap.set(topic.id, existing);
      } else if (cached) {
        newMap.set(topic.id, {
          id: topic.id,
          topic,
          x: cached.x,
          y: cached.y,
          vx: 0,
          vy: 0,
          radius: settings.nodeSize,
          status,
        });
      } else {
        // Deterministic polar placement to avoid visual shock or 0,0 collision
        const angle = (i / Math.max(1, count)) * 2 * Math.PI;
        const initialX = Math.cos(angle) * radiusDist;
        const initialY = Math.sin(angle) * radiusDist;

        newMap.set(topic.id, {
          id: topic.id,
          topic,
          x: initialX,
          y: initialY,
          vx: 0,
          vy: 0,
          radius: settings.nodeSize,
          status,
        });

        globalNodePositionCache.set(topic.id, { x: initialX, y: initialY });
        addedNewNodes = true;
      }
    });

    simNodesRef.current = newMap;

    if (addedNewNodes) {
      wakeSimulation(0.35);
    } else {
      requestRender();
    }
  }, [filteredTopics, statuses, settings.nodeSize, wakeSimulation]);

  // Direct neighbours of active or hovered node
  const directNeighbours = useMemo(() => {
    const targetId = hoveredNodeId || selectedTopicId;
    if (!targetId) return new Set<string>();

    const adj = activeAdjacencyMap.get(targetId);
    if (!adj) return new Set<string>([targetId]);

    const set = new Set<string>(adj.all);
    set.add(targetId);
    return set;
  }, [hoveredNodeId, selectedTopicId, activeAdjacencyMap]);

  // Compute node color based on grouping setting
  const getNodeColor = useCallback((node: SimNode, isSelected: boolean, isNeighbour: boolean, isDimmed: boolean) => {
    if (isSelected) {
      return { fill: '#ffffff', stroke: '#ffffff', text: '#ffffff' };
    }

    let baseColor = '#71717a';
    if (settings.colorGroupBy === 'folder') {
      baseColor = FOLDER_COLORS[node.topic.folderId] || '#71717a';
    } else if (settings.colorGroupBy === 'status') {
      baseColor = STATUS_COLORS[node.status] || '#71717a';
    } else if (settings.colorGroupBy === 'category') {
      baseColor = CATEGORY_COLORS[node.topic.category] || '#71717a';
    }

    if (isNeighbour) {
      return { fill: baseColor, stroke: '#ffffff', text: '#ffffff' };
    }

    return { fill: baseColor, stroke: baseColor, text: '#a1a1aa' };
  }, [settings.colorGroupBy]);

  // Draw arrow head on directed edges
  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    targetRadius: number,
    scale: number,
    color: string
  ) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const dist = Math.hypot(dx, dy);
    if (dist < targetRadius + 6) return;

    // Angle entering the target node along the straight edge
    const angle = Math.atan2(dy, dx);
    const arrowX = toX - Math.cos(angle) * (targetRadius + 2 / scale);
    const arrowY = toY - Math.sin(angle) * (targetRadius + 2 / scale);
    const headLen = 4.5 / scale;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX - headLen * Math.cos(angle - Math.PI / 6), arrowY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(arrowX - headLen * Math.cos(angle + Math.PI / 6), arrowY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  // Main Canvas Render
  const drawCanvas = useCallback(() => {
    renderRequestedRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || (canvas.width / dpr) || 600;
    const height = rect.height || (canvas.height / dpr) || 600;
    const curCam = cameraRef.current;

    // Clean background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#141416';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.translate(width / 2 + curCam.x, height / 2 + curCam.y);
    ctx.scale(curCam.scale, curCam.scale);

    const nodeMap = simNodesRef.current;
    const hasFocus = !!(selectedTopicId || hoveredNodeId);
    const activeTarget = hoveredNodeId || selectedTopicId;

    // 1. Draw Straight Connection Edges
    const lineThickness = settings.linkThickness / curCam.scale;
    filteredEdges.forEach(edge => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;

      const isConnectedToTarget = edge.source === activeTarget || edge.target === activeTarget;
      const isDimmed = hasFocus && !isConnectedToTarget;

      ctx.save();
      // Moderate: Dim unrelated edges to 40% opacity
      ctx.globalAlpha = isDimmed ? 0.40 : 1.0;

      ctx.beginPath();
      if (isConnectedToTarget) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = lineThickness * 1.8;
      } else if (isDimmed) {
        ctx.strokeStyle = '#383842';
        ctx.lineWidth = lineThickness * 0.8;
      } else {
        ctx.strokeStyle = '#2c2d33';
        ctx.lineWidth = lineThickness;
      }

      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();

      // Optional Directional Arrows oriented along the straight edge
      if (settings.showArrows) {
        const arrowColor = isConnectedToTarget ? '#ffffff' : '#52525b';
        drawArrowHead(ctx, s.x, s.y, t.x, t.y, t.radius, curCam.scale, arrowColor);
      }
      ctx.restore();
    });

    // 2. Draw Nodes
    const nodes = Array.from(nodeMap.values());
    nodes.forEach(node => {
      const isSelected = node.id === selectedTopicId;
      const isHovered = node.id === hoveredNodeId;
      const isNeighbour = directNeighbours.has(node.id);
      const isDimmed = hasFocus && !isNeighbour;
      const isLocalFocus = graphMode === 'local' && node.id === localFocusTopicId;

      ctx.save();
      // Moderate: Dim unrelated nodes to 40% opacity
      ctx.globalAlpha = isDimmed ? 0.40 : 1.0;

      const colors = getNodeColor(node, isSelected, isNeighbour, isDimmed);
      const baseRadius = settings.nodeSize;
      const radius = isSelected ? baseRadius * 1.4 : isHovered ? baseRadius * 1.25 : baseRadius;

      // Selection clean focus ring (Obsidian subtle halo)
      if (isSelected || isLocalFocus) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 3.4 / curCam.scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4 / curCam.scale;
        ctx.stroke();
      }

      // Circular Node Disc
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors.fill;
      ctx.fill();

      // Border stroke
      ctx.lineWidth = (isSelected ? 1.6 : isNeighbour ? 1.2 : 0.8) / curCam.scale;
      ctx.strokeStyle = colors.stroke;
      ctx.stroke();

      // Prerequisite Gap Dashed Indicator
      const isMissingPrereq = missingPrerequisiteNodeIds?.has(node.id) || 
        (filterOptions.highlightMode === 'gaps' && node.status !== 'learned');
      if (isMissingPrereq) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 2.4 / curCam.scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 0.9 / curCam.scale;
        ctx.setLineDash([2.2 / curCam.scale, 2.2 / curCam.scale]);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Compact Topic Label
      if (settings.showLabels) {
        const shouldShowLabel = 
          !settings.fadeLabelsOnZoom || 
          curCam.scale > 0.72 || 
          isSelected || 
          isHovered || 
          isNeighbour ||
          isLocalFocus;

        if (shouldShowLabel) {
          const fontSize = Math.max(9, Math.min(12, 10.5 / curCam.scale));
          ctx.font = `${(isSelected || isHovered) ? '600' : isNeighbour ? '500' : '400'} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = colors.text;

          // Truncate long titles to prevent spanning across canvas
          const titleText = node.topic.title.length > 25 
            ? node.topic.title.slice(0, 23) + '…' 
            : node.topic.title;

          ctx.fillText(titleText, node.x + radius + 4.5, node.y);
        }
      }

      ctx.restore();
    });

    ctx.restore();
  }, [
    filteredEdges, 
    selectedTopicId, 
    hoveredNodeId, 
    directNeighbours, 
    getNodeColor,
    missingPrerequisiteNodeIds,
    filterOptions.highlightMode,
    settings,
    graphMode,
    localFocusTopicId
  ]);

  // Request a single canvas frame render without spinning physics
  const requestRender = useCallback(() => {
    if (!renderRequestedRef.current) {
      renderRequestedRef.current = true;
      requestAnimationFrame(() => {
        renderRequestedRef.current = false;
        drawCanvas();
      });
    }
  }, [drawCanvas]);

  // Main force-directed physics & smooth camera animation loop
  useEffect(() => {
    isCancelledRef.current = false;

    const tick = () => {
      if (isCancelledRef.current) return;

      // 1. Smooth Camera Interpolation (ease-out lerp for buttery smooth zoom/pan transitions)
      const curCam = cameraRef.current;
      const targetCam = targetCameraRef.current;
      const scaleDiff = targetCam.scale - curCam.scale;
      const xDiff = targetCam.x - curCam.x;
      const yDiff = targetCam.y - curCam.y;
      const isCameraMoving = Math.abs(scaleDiff) > 0.0004 || Math.abs(xDiff) > 0.05 || Math.abs(yDiff) > 0.05;

      if (isCameraMoving) {
        const camLerp = 0.20;
        curCam.scale += scaleDiff * camLerp;
        curCam.x += xDiff * camLerp;
        curCam.y += yDiff * camLerp;
        saveStoredCamera(curCam);
      } else {
        curCam.scale = targetCam.scale;
        curCam.x = targetCam.x;
        curCam.y = targetCam.y;
      }

      // 2. Physics Simulation Step
      const isDragging = dragRef.current.draggedNodeId !== null && dragRef.current.hasMoved;
      const shouldSimulate = !isPhysicsPausedByUser && !isSleepingRef.current && (isDragging || alphaRef.current >= 0.002);

      if (shouldSimulate) {
        const nodes = Array.from(simNodesRef.current.values());
        const nodeMap = simNodesRef.current;
        const currentAlpha = isDragging ? Math.max(alphaRef.current, 0.28) : alphaRef.current;

        // Pairwise Repulsion and Soft-Body Collision Prevention
        const repulsionDist = settings.repulsion;

        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            let dx = n2.x - n1.x;
            let dy = n2.y - n1.y;

            // Handle exact coincidence (identical coordinates)
            if (dx === 0 && dy === 0) {
              const angle = ((i + j) % 17) * 0.37;
              dx = Math.cos(angle) * 3;
              dy = Math.sin(angle) * 3;
            }

            const dist = Math.hypot(dx, dy) || 0.1;

            // a. Soft-body collision prevention (cushioned contact spring, eliminates overlap without teleport jitter)
            const minSeparation = n1.radius + n2.radius + 18;
            if (dist < minSeparation) {
              const overlap = minSeparation - dist;
              const nx = dx / dist;
              const ny = dy / dist;
              const ratio = overlap / minSeparation;
              // Smooth progressive cushion force
              const cushion = ratio * ratio * 1.6 * Math.max(currentAlpha, 0.30);
              
              // Relative normal velocity damping to prevent oscillatory bounce
              const relVel = (n2.vx - n1.vx) * nx + (n2.vy - n1.vy) * ny;
              const damping = relVel * 0.28;
              const push = cushion + damping;

              const isN1Dragged = dragRef.current.draggedNodeId === n1.id && dragRef.current.hasMoved;
              const isN2Dragged = dragRef.current.draggedNodeId === n2.id && dragRef.current.hasMoved;

              if (!isN1Dragged) {
                n1.vx -= nx * push;
                n1.vy -= ny * push;
                n1.x -= nx * overlap * 0.06;
                n1.y -= ny * overlap * 0.06;
              }
              if (!isN2Dragged) {
                n2.vx += nx * push;
                n2.vy += ny * push;
                n2.x += nx * overlap * 0.06;
                n2.y += ny * overlap * 0.06;
              }
            }

            // b. Smoothstep Hermite Force-Directed Repulsion (C1 continuous at boundary)
            if (dist < repulsionDist) {
              const tNorm = (repulsionDist - dist) / repulsionDist;
              const smooth = tNorm * tNorm * (3 - 2 * tNorm);
              const repForce = smooth * 0.75 * currentAlpha;
              const fx = (dx / dist) * repForce;
              const fy = (dy / dist) * repForce;

              const isN1Dragged = dragRef.current.draggedNodeId === n1.id && dragRef.current.hasMoved;
              const isN2Dragged = dragRef.current.draggedNodeId === n2.id && dragRef.current.hasMoved;

              if (!isN1Dragged) {
                n1.vx -= fx;
                n1.vy -= fy;
              }
              if (!isN2Dragged) {
                n2.vx += fx;
                n2.vy += fy;
              }
            }
          }
        }

        // c. Hooke's Spring force along genuine note edges
        filteredEdges.forEach(edge => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return;

          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.hypot(dx, dy) || 1;
          const targetDist = settings.linkDistance;
          const delta = dist - targetDist;
          const springForce = delta * settings.linkStrength * currentAlpha;

          const fx = (dx / dist) * springForce;
          const fy = (dy / dist) * springForce;

          const isSDragged = dragRef.current.draggedNodeId === s.id && dragRef.current.hasMoved;
          const isTDragged = dragRef.current.draggedNodeId === t.id && dragRef.current.hasMoved;

          if (!isSDragged) {
            s.vx += fx;
            s.vy += fy;
          }
          if (!isTDragged) {
            t.vx -= fx;
            t.vy -= fy;
          }
        });

        // d. Central Gravity, velocity damping & position integration
        let maxMovement = 0;
        nodes.forEach(n => {
          const isNodeDragged = dragRef.current.draggedNodeId === n.id && dragRef.current.hasMoved;
          if (isNodeDragged) {
            // Dragged node velocity is maintained for edge flex, position updated by pointer
            return;
          }

          // Gentle central attraction to prevent disconnected nodes from drifting away
          n.vx -= n.x * settings.centerForce * currentAlpha;
          n.vy -= n.y * settings.centerForce * currentAlpha;

          // Viscous fluid damping (0.86) and velocity limit
          const speed = Math.hypot(n.vx, n.vy);
          const maxSpeed = 7.0;
          if (speed > maxSpeed) {
            n.vx = (n.vx / speed) * maxSpeed;
            n.vy = (n.vy / speed) * maxSpeed;
          }
          n.vx *= 0.86;
          n.vy *= 0.86;

          n.x += n.vx;
          n.y += n.vy;

          globalNodePositionCache.set(n.id, { x: n.x, y: n.y });

          const move = Math.abs(n.vx) + Math.abs(n.vy);
          if (move > maxMovement) maxMovement = move;
        });

        if (isDragging) {
          alphaRef.current = Math.max(alphaRef.current, 0.28);
          isSleepingRef.current = false;
        } else {
          // Smooth cooling schedule
          alphaRef.current *= 0.965;

          if (alphaRef.current < 0.003 || maxMovement < 0.016) {
            isSleepingRef.current = true;
            alphaRef.current = 0;
            nodes.forEach(n => { n.vx = 0; n.vy = 0; });
            saveStoredNodePositions(globalNodePositionCache);
          }
        }
      }

      drawCanvas();

      // Continue animation loop if either physics is active or camera is interpolating
      const keepLooping = (!isSleepingRef.current && !isPhysicsPausedByUser) || isCameraMoving;
      if (keepLooping) {
        animFrameIdRef.current = requestAnimationFrame(runSimulationFrame);
      } else {
        animFrameIdRef.current = null;
      }
    };

    tickRef.current = tick;

    // Start simulation loop if active and not paused, or if camera needs to animate
    if ((!isSleepingRef.current && !isPhysicsPausedByUser) || animFrameIdRef.current === null) {
      startSimulation();
    }

    return () => {
      isCancelledRef.current = true;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isPhysicsPausedByUser, filteredEdges, drawCanvas, settings, runSimulationFrame, startSimulation]);

  // ResizeObserver for canvas buffer without resetting coordinates or camera
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const dpr = window.devicePixelRatio || 1;
          const targetW = Math.round(width * dpr);
          const targetH = Math.round(height * dpr);
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }
          requestRender();
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [requestRender]);

  // Refresh frame when tab becomes active
  useEffect(() => {
    if (isActive) {
      requestRender();
    }
  }, [isActive, requestRender]);

  // Screen to world transform
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const curCam = cameraRef.current;
    const x = screenX - rect.left - rect.width / 2 - curCam.x;
    const y = screenY - rect.top - rect.height / 2 - curCam.y;
    return {
      x: x / curCam.scale,
      y: y / curCam.scale,
    };
  }, []);

  // Hit test with screen-space touch tolerance
  const findNodeAtWorldPos = useCallback((worldX: number, worldY: number, screenTolerance = 0) => {
    const nodes = Array.from(simNodesRef.current.values());
    const curCam = cameraRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const effectiveTol = screenTolerance > 0 ? screenTolerance / curCam.scale : 6.0;
      if (dist <= n.radius + effectiveTol) {
        return n;
      }
    }
    return null;
  }, []);

  // Cursor-Centric Zoom with smooth camera lerp
  const zoomAtPoint = useCallback((factor: number, clientX: number, clientY: number, immediate = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const curTarget = targetCameraRef.current;
    const newScale = Math.min(3.8, Math.max(0.18, curTarget.scale * factor));
    if (Math.abs(newScale - curTarget.scale) < 0.0005) return;

    const worldX = (mouseX - rect.width / 2 - curTarget.x) / curTarget.scale;
    const worldY = (mouseY - rect.height / 2 - curTarget.y) / curTarget.scale;

    const newX = mouseX - rect.width / 2 - worldX * newScale;
    const newY = mouseY - rect.height / 2 - worldY * newScale;

    targetCameraRef.current = { scale: newScale, x: newX, y: newY };

    if (immediate) {
      cameraRef.current = { ...targetCameraRef.current };
      saveStoredCamera(cameraRef.current);
      requestRender();
    } else {
      startSimulation();
    }
  }, [startSimulation, requestRender]);

  // Non-passive wheel handler (prevents browser back swipe and page scrolling)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();

      let factor: number;
      if (e.ctrlKey) {
        // Trackpad pinch-to-zoom
        factor = Math.exp(-e.deltaY * 0.009);
      } else {
        // Continuous smooth wheel zoom
        const delta = Math.sign(e.deltaY);
        factor = delta < 0 ? 1.14 : 0.88;
      }

      zoomAtPoint(factor, e.clientX, e.clientY, false);
    };

    canvas.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheelNative);
    };
  }, [zoomAtPoint]);

  // Touch Handlers for Mobile & Trackpad
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const worldPos = screenToWorld(touch.clientX, touch.clientY);
      // Use 24px screen-space hit tolerance for finger touches
      const hitNode = findNodeAtWorldPos(worldPos.x, worldPos.y, 24);

      dragRef.current = {
        isDraggingCanvas: !hitNode,
        draggedNodeId: hitNode ? hitNode.id : null,
        startX: touch.clientX,
        startY: touch.clientY,
        initialCamX: cameraRef.current.x,
        initialCamY: cameraRef.current.y,
        hasMoved: false,
        dragOffsetX: hitNode ? worldPos.x - hitNode.x : 0,
        dragOffsetY: hitNode ? worldPos.y - hitNode.y : 0,
      };

      touchStateRef.current.isMultiTouch = false;
      touchStateRef.current.lastTouchX = touch.clientX;
      touchStateRef.current.lastTouchY = touch.clientY;

      if (hitNode) {
        onSelectTopic(hitNode.id);
        setHoveredNodeId(hitNode.id);
      }
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

      touchStateRef.current = {
        initialDist: dist,
        initialScale: cameraRef.current.scale,
        lastTouchX: (t1.clientX + t2.clientX) / 2,
        lastTouchY: (t1.clientY + t2.clientY) / 2,
        isMultiTouch: true,
      };

      dragRef.current.isDraggingCanvas = false;
      dragRef.current.draggedNodeId = null;
      dragRef.current.hasMoved = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && !touchStateRef.current.isMultiTouch) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > 3) {
        dragRef.current.hasMoved = true;
      }

      if (dragRef.current.draggedNodeId && dragRef.current.hasMoved) {
        const worldPos = screenToWorld(touch.clientX, touch.clientY);
        const node = simNodesRef.current.get(dragRef.current.draggedNodeId);
        if (node) {
          const targetX = worldPos.x - dragRef.current.dragOffsetX;
          const targetY = worldPos.y - dragRef.current.dragOffsetY;
          node.vx = (targetX - node.x) * 0.5;
          node.vy = (targetY - node.y) * 0.5;
          node.x = targetX;
          node.y = targetY;
          globalNodePositionCache.set(node.id, { x: node.x, y: node.y });
          wakeSimulation(0.32);
        }
      } else if (dragRef.current.isDraggingCanvas) {
        const nextX = dragRef.current.initialCamX + dx;
        const nextY = dragRef.current.initialCamY + dy;
        cameraRef.current.x = nextX;
        cameraRef.current.y = nextY;
        targetCameraRef.current.x = nextX;
        targetCameraRef.current.y = nextY;
        requestRender();
      }
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      if (touchStateRef.current.initialDist > 0) {
        const factor = dist / touchStateRef.current.initialDist;
        zoomAtPoint(factor, midX, midY, true);
        touchStateRef.current.initialDist = dist;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!dragRef.current.hasMoved && dragRef.current.draggedNodeId) {
      // Single tap selects and opens note in workspace
      const tappedId = dragRef.current.draggedNodeId;
      onSelectTopic(tappedId);
      onOpenNote(tappedId);
      requestRender();
    } else if (dragRef.current.draggedNodeId && dragRef.current.hasMoved) {
      // Release node naturally, allowing graph to settle into stable arrangement
      wakeSimulation(0.24);
      saveStoredNodePositions(globalNodePositionCache);
    }

    dragRef.current.isDraggingCanvas = false;
    dragRef.current.draggedNodeId = null;
    dragRef.current.hasMoved = false;
    touchStateRef.current.isMultiTouch = false;
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Left click only

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtWorldPos(worldPos.x, worldPos.y);

    dragRef.current = {
      isDraggingCanvas: !hitNode,
      draggedNodeId: hitNode ? hitNode.id : null,
      startX: e.clientX,
      startY: e.clientY,
      initialCamX: cameraRef.current.x,
      initialCamY: cameraRef.current.y,
      hasMoved: false,
      dragOffsetX: hitNode ? worldPos.x - hitNode.x : 0,
      dragOffsetY: hitNode ? worldPos.y - hitNode.y : 0,
    };

    if (hitNode) {
      onSelectTopic(hitNode.id);
      requestRender();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Dragging Node (Rearranging with connected spring physics)
    if (dragRef.current.draggedNodeId) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 3) {
        dragRef.current.hasMoved = true;
      }

      if (dragRef.current.hasMoved) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        const node = simNodesRef.current.get(dragRef.current.draggedNodeId);
        if (node) {
          const targetX = worldPos.x - dragRef.current.dragOffsetX;
          const targetY = worldPos.y - dragRef.current.dragOffsetY;
          node.vx = (targetX - node.x) * 0.5;
          node.vy = (targetY - node.y) * 0.5;
          node.x = targetX;
          node.y = targetY;
          globalNodePositionCache.set(node.id, { x: node.x, y: node.y });
          wakeSimulation(0.32);
        }
      }
      return;
    }

    // 2. Dragging Canvas (Panning)
    if (dragRef.current.isDraggingCanvas) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 3) {
        dragRef.current.hasMoved = true;
      }
      const nextX = dragRef.current.initialCamX + dx;
      const nextY = dragRef.current.initialCamY + dy;
      cameraRef.current.x = nextX;
      cameraRef.current.y = nextY;
      targetCameraRef.current.x = nextX;
      targetCameraRef.current.y = nextY;
      requestRender();
      return;
    }

    // 3. Pointer Hover Detection (Reveals connections smoothly without moving graph)
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtWorldPos(worldPos.x, worldPos.y);
    const newHoverId = hitNode ? hitNode.id : null;

    if (newHoverId !== hoveredNodeId) {
      setHoveredNodeId(newHoverId);
      requestRender();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // If clicked without dragging
    if (!dragRef.current.hasMoved) {
      if (dragRef.current.draggedNodeId) {
        // Single click selects and opens note in workspace
        const clickedId = dragRef.current.draggedNodeId;
        onSelectTopic(clickedId);
        onOpenNote(clickedId);
        requestRender();
      } else if (dragRef.current.isDraggingCanvas) {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        const hitNode = findNodeAtWorldPos(worldPos.x, worldPos.y);
        if (hitNode) {
          onSelectTopic(hitNode.id);
          onOpenNote(hitNode.id);
          requestRender();
        } else if (selectedTopicId) {
          // Deselect on empty canvas click to restore normal view
          onSelectTopic('');
          requestRender();
        }
      }
    } else if (dragRef.current.draggedNodeId) {
      // Dragging finished: release node and let connected graph settle naturally
      wakeSimulation(0.24);
      saveStoredNodePositions(globalNodePositionCache);
    }

    dragRef.current.isDraggingCanvas = false;
    dragRef.current.draggedNodeId = null;
    dragRef.current.hasMoved = false;
  };

  const handleMouseLeave = () => {
    if (dragRef.current.draggedNodeId && dragRef.current.hasMoved) {
      wakeSimulation(0.24);
      saveStoredNodePositions(globalNodePositionCache);
    }
    dragRef.current.isDraggingCanvas = false;
    dragRef.current.draggedNodeId = null;
    dragRef.current.hasMoved = false;
    if (hoveredNodeId !== null) {
      setHoveredNodeId(null);
      requestRender();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtWorldPos(worldPos.x, worldPos.y);
    if (hitNode) {
      onSelectTopic(hitNode.id);
      onOpenNote(hitNode.id);
    }
  };

  // Fit all nodes smoothly into screen view
  const handleFitToScreen = useCallback(() => {
    const nodes = Array.from(simNodesRef.current.values());
    const canvas = canvasRef.current;
    if (nodes.length === 0 || !canvas) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y);
    });

    const w = maxX - minX || 220;
    const h = maxY - minY || 220;
    const rect = canvas.getBoundingClientRect();
    const cW = rect.width || 600;
    const cH = rect.height || 600;

    const scale = Math.min(1.4, Math.max(0.35, Math.min((cW - 120) / w, (cH - 120) / h)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    targetCameraRef.current = {
      scale,
      x: -centerX * scale,
      y: -centerY * scale,
    };
    startSimulation();
  }, [startSimulation]);

  // Reset View smoothly (1:1 zoom, centered at origin)
  const handleResetView = useCallback(() => {
    targetCameraRef.current = {
      scale: 1.0,
      x: 0,
      y: 0,
    };
    startSimulation();
  }, [startSimulation]);

  // Center camera smoothly on currently selected topic
  const handleFocusSelected = useCallback(() => {
    if (!selectedTopicId) return;
    const node = simNodesRef.current.get(selectedTopicId);
    if (!node) return;

    const targetScale = Math.max(1.1, cameraRef.current.scale);
    targetCameraRef.current = {
      scale: targetScale,
      x: -node.x * targetScale,
      y: -node.y * targetScale,
    };
    startSimulation();
  }, [selectedTopicId, startSimulation]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showSettingsDrawer) {
        setShowSettingsDrawer(false);
      } else if (selectedTopicId) {
        onSelectTopic('');
      }
    } else if (e.key === 'Enter') {
      if (selectedTopicId) {
        onOpenNote(selectedTopicId);
      }
    } else if (e.key === '+' || e.key === '=') {
      const canvas = canvasRef.current;
      const cx = canvas ? canvas.width / 2 : window.innerWidth / 2;
      const cy = canvas ? canvas.height / 2 : window.innerHeight / 2;
      zoomAtPoint(1.18, cx, cy);
    } else if (e.key === '-') {
      const canvas = canvasRef.current;
      const cx = canvas ? canvas.width / 2 : window.innerWidth / 2;
      const cy = canvas ? canvas.height / 2 : window.innerHeight / 2;
      zoomAtPoint(0.85, cx, cy);
    } else if (e.key === '0' || e.key.toLowerCase() === 'f') {
      handleFitToScreen();
    } else if (e.key.toLowerCase() === 'r') {
      handleResetView();
    } else if (e.key === ' ') {
      e.preventDefault();
      const next = !isPhysicsPausedByUser;
      setIsPhysicsPausedByUser(next);
      if (!next) wakeSimulation(0.35);
    }
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId);
  const hoveredNode = hoveredNodeId ? simNodesRef.current.get(hoveredNodeId) : null;
  const activeAdjacency = (hoveredNodeId || selectedTopicId) 
    ? activeAdjacencyMap.get(hoveredNodeId || selectedTopicId!) 
    : null;
  const activeConnectionsCount = (activeAdjacency?.incoming.length || 0) + (activeAdjacency?.outgoing.length || 0);

  return (
    <div 
      ref={containerRef} 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full h-full bg-[#141416] overflow-hidden select-none outline-none"
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top-Left Native Obsidian Toolbar: Mode & Quick Settings Button */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 sm:gap-1.5 bg-[#18181b]/95 border border-[#2b2b32] rounded-md px-1.5 sm:px-2 py-1 text-xs backdrop-blur-md max-w-[calc(100vw-3.75rem)] sm:max-w-none overflow-x-auto no-scrollbar">
        {/* View Format Segmented Switcher (Graph vs List) */}
        <div className="flex items-center bg-[#131315] rounded p-0.5 border border-[#242428] shrink-0">
          <button
            onClick={() => setViewFormat('canvas')}
            className={`px-2 py-0.5 text-[11px] rounded transition-all touch-manipulation ${
              viewFormat === 'canvas'
                ? 'bg-[#27272a] text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Interactive 2D graph view"
          >
            Graph
          </button>
          <button
            onClick={() => setViewFormat('list')}
            className={`px-2 py-0.5 text-[11px] rounded transition-all touch-manipulation ${
              viewFormat === 'list'
                ? 'bg-[#27272a] text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Grouped syllabus topic list"
          >
            List
          </button>
        </div>

        <div className="w-px h-3.5 bg-[#2b2b32] mx-0.5 shrink-0" />

        {/* Graph Mode Segmented Switcher (Global vs Local) */}
        <div className="flex items-center bg-[#131315] rounded p-0.5 border border-[#242428] shrink-0">
          <button
            onClick={() => {
              onUpdateFilters({ graphMode: 'global' });
              wakeSimulation(0.35);
            }}
            className={`px-2 py-0.5 text-[11px] rounded transition-all touch-manipulation ${
              graphMode === 'global'
                ? 'bg-[#27272a] text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Global graph: All topics in workspace"
          >
            Global
          </button>
          <button
            onClick={() => {
              onUpdateFilters({ graphMode: 'local' });
              wakeSimulation(0.35);
            }}
            className={`px-2 py-0.5 text-[11px] rounded transition-all touch-manipulation ${
              graphMode === 'local'
                ? 'bg-[#27272a] text-zinc-100 font-medium shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Local graph: Focused neighborhood around active topic"
          >
            Local
          </button>
        </div>

        {/* If in Local mode, show depth controls */}
        {graphMode === 'local' && (
          <div className="flex items-center gap-1 pl-1 border-l border-[#2b2b32] shrink-0">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider hidden xs:inline">Depth</span>
            {[1, 2, 3].map(depthVal => (
              <button
                key={depthVal}
                onClick={() => {
                  onUpdateFilters({ localDepth: depthVal });
                  wakeSimulation(0.35);
                }}
                className={`w-4 h-4 flex items-center justify-center rounded text-[10px] font-mono transition-colors touch-manipulation ${
                  localDepth === depthVal
                    ? 'bg-[#28282e] text-white border border-zinc-600'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={`Expand local neighborhood by ${depthVal} ${depthVal === 1 ? 'hop' : 'hops'}`}
              >
                {depthVal}
              </button>
            ))}
          </div>
        )}

        <div className="w-px h-3.5 bg-[#2b2b32] mx-0.5 shrink-0" />

        {/* Quick Filter Search */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              wakeSimulation(0.3);
            }}
            placeholder="Search..."
            className="bg-transparent text-zinc-200 text-[11px] placeholder-zinc-500 focus:outline-none w-20 sm:w-32"
          />
          {localSearch && (
            <button 
              onClick={() => {
                setLocalSearch('');
                wakeSimulation(0.3);
              }} 
              className="text-zinc-500 hover:text-zinc-300 touch-manipulation"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="w-px h-3.5 bg-[#2b2b32] mx-0.5 shrink-0" />

        {/* Graph Settings Gear / Sliders Drawer Trigger */}
        <button
          onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
          className={`p-1 rounded transition-colors shrink-0 touch-manipulation ${
            showSettingsDrawer 
              ? 'text-white bg-[#25252b] border border-zinc-700/60' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202024]'
          }`}
          title="Graph settings and display controls"
          aria-label="Graph settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Obsidian-Style Floating Settings Panel */}
      {showSettingsDrawer && (
        <div className="absolute top-12 left-3 z-30 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100%-4rem)] overflow-y-auto bg-[#18181b]/98 border border-[#2b2b32] rounded-lg p-3 shadow-2xl text-[11px] text-zinc-300 backdrop-blur-md animate-in fade-in-50 duration-100">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 font-medium text-zinc-200 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-300" />
              <span>Graph settings</span>
            </div>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-[#242428]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-1 mb-3 bg-[#131315] p-0.5 rounded border border-[#242428]">
            <button
              onClick={() => setActiveSettingsTab('filters')}
              className={`flex-1 py-1 rounded text-center text-[10px] font-medium transition-colors ${
                activeSettingsTab === 'filters'
                  ? 'bg-[#27272a] text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Filters
            </button>
            <button
              onClick={() => setActiveSettingsTab('groups')}
              className={`flex-1 py-1 rounded text-center text-[10px] font-medium transition-colors ${
                activeSettingsTab === 'groups'
                  ? 'bg-[#27272a] text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveSettingsTab('display')}
              className={`flex-1 py-1 rounded text-center text-[10px] font-medium transition-colors ${
                activeSettingsTab === 'display'
                  ? 'bg-[#27272a] text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Display
            </button>
            <button
              onClick={() => setActiveSettingsTab('forces')}
              className={`flex-1 py-1 rounded text-center text-[10px] font-medium transition-colors ${
                activeSettingsTab === 'forces'
                  ? 'bg-[#27272a] text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Forces
            </button>
          </div>

          {/* 1. FILTERS TAB */}
          {activeSettingsTab === 'filters' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-zinc-400 mb-1">Folder / Module</label>
                <select
                  value={filterOptions.selectedFolder}
                  onChange={(e) => {
                    onUpdateFilters({ selectedFolder: e.target.value });
                    wakeSimulation(0.35);
                  }}
                  className="w-full bg-[#131315] border border-[#27272a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
                >
                  <option value="all">All Folders</option>
                  <option value="functional-materials">📁 Functional Materials (All 6 Chapters)</option>
                  <option value="01-oxides">  └─ 01 Oxides</option>
                  <option value="02-polymers">  └─ 02 Polymers</option>
                  <option value="03-conducting-polymers">  └─ 03 Conducting Polymers</option>
                  <option value="04-nanomaterials">  └─ 04 Nanotechnology and Nanomaterials</option>
                  <option value="05-synthesis-nanomaterials">  └─ 05 Synthesis of Nanomaterials</option>
                  <option value="06-oleds">  └─ 06 OLEDs</option>
                  <option value="personal">📁 Personal Notes</option>
                  <option value="unsorted">📁 Unsorted Notes</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Learning Status</label>
                <select
                  value={filterOptions.selectedStatus}
                  onChange={(e) => {
                    onUpdateFilters({ selectedStatus: e.target.value as any });
                    wakeSimulation(0.35);
                  }}
                  className="w-full bg-[#131315] border border-[#27272a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="not_studied">Not studied</option>
                  <option value="learning">Learning</option>
                  <option value="needs_revision">Needs revision</option>
                  <option value="learned">Learned</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Relationship Type</label>
                <select
                  value={filterOptions.selectedRelationType}
                  onChange={(e) => {
                    onUpdateFilters({ selectedRelationType: e.target.value as any });
                    wakeSimulation(0.35);
                  }}
                  className="w-full bg-[#131315] border border-[#27272a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
                >
                  <option value="all">All relationships</option>
                  <option value="prerequisite">Prerequisites only</option>
                  <option value="part_of">Part of</option>
                  <option value="preparation_of">Preparation of</option>
                  <option value="application_of">Applications of</option>
                  <option value="related">Related</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Special Highlight</label>
                <select
                  value={filterOptions.highlightMode}
                  onChange={(e) => {
                    onUpdateFilters({ highlightMode: e.target.value as any });
                    requestRender();
                  }}
                  className="w-full bg-[#131315] border border-[#27272a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
                >
                  <option value="all">Standard connections</option>
                  <option value="immediate">Immediate neighbors</option>
                  <option value="prerequisites">Prerequisites</option>
                  <option value="gaps">⚠️ Prerequisite Gaps</option>
                  <option value="isolated">Isolated topics</option>
                </select>
              </div>

              <div className="pt-1 border-t border-[#27272a]">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={!!filterOptions.hideOrphans}
                    onChange={(e) => {
                      onUpdateFilters({ hideOrphans: e.target.checked });
                      wakeSimulation(0.35);
                    }}
                    className="rounded bg-[#131315] border-[#27272a] accent-zinc-400 focus:ring-0"
                  />
                  <span className="text-zinc-300">Hide unconnected notes (orphans)</span>
                </label>
              </div>

              <div className="pt-2 border-t border-[#27272a] flex justify-end">
                <button
                  onClick={() => {
                    onUpdateFilters({
                      selectedFolder: 'all',
                      selectedStatus: 'all',
                      selectedRelationType: 'all',
                      highlightMode: 'all',
                      hideOrphans: false,
                      searchQuery: '',
                    });
                    setLocalSearch('');
                    wakeSimulation(0.35);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-400 hover:text-zinc-200 hover:bg-[#202024] rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {/* 2. GROUPS TAB */}
          {activeSettingsTab === 'groups' && (
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Color Grouping</label>
                <select
                  value={settings.colorGroupBy}
                  onChange={(e) => {
                    updateSetting('colorGroupBy', e.target.value as any);
                    requestRender();
                  }}
                  className="w-full bg-[#131315] border border-[#27272a] rounded px-2 py-1 text-zinc-200 focus:outline-none"
                >
                  <option value="none">None (Monochrome Graphite)</option>
                  <option value="folder">By Folder / Module</option>
                  <option value="status">By Learning Status</option>
                  <option value="category">By Topic Category</option>
                </select>
              </div>

              {/* Group Legend */}
              <div className="p-2 bg-[#131315] rounded border border-[#242428] space-y-1.5 text-[10px]">
                <span className="text-zinc-500 uppercase tracking-wider block font-mono">Legend</span>
                {settings.colorGroupBy === 'folder' && (
                  <div className="space-y-1">
                    {Object.entries(FOLDER_COLORS).map(([fid, col]) => (
                      <div key={fid} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col }} />
                        <span className="text-zinc-300">{FOLDER_LABELS[fid] || fid.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
                {settings.colorGroupBy === 'status' && (
                  <div className="space-y-1">
                    {Object.entries(STATUS_COLORS).map(([st, col]) => (
                      <div key={st} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col }} />
                        <span className="text-zinc-300 capitalize">{st.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
                {settings.colorGroupBy === 'category' && (
                  <div className="space-y-1">
                    {Object.entries(CATEGORY_COLORS).slice(0, 6).map(([cat, col]) => (
                      <div key={cat} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col }} />
                        <span className="text-zinc-300 truncate">{cat}</span>
                      </div>
                    ))}
                  </div>
                )}
                {settings.colorGroupBy === 'none' && (
                  <p className="text-zinc-400">Nodes use uniform quiet slate with active connection highlighting.</p>
                )}
              </div>
            </div>
          )}

          {/* 3. DISPLAY TAB */}
          {activeSettingsTab === 'display' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Node Size</span>
                  <span className="font-mono">{settings.nodeSize}px</span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="9.0"
                  step="0.5"
                  value={settings.nodeSize}
                  onChange={(e) => {
                    updateSetting('nodeSize', parseFloat(e.target.value));
                    requestRender();
                  }}
                  className="w-full accent-zinc-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Link Thickness</span>
                  <span className="font-mono">{settings.linkThickness}px</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={settings.linkThickness}
                  onChange={(e) => {
                    updateSetting('linkThickness', parseFloat(e.target.value));
                    requestRender();
                  }}
                  className="w-full accent-zinc-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#27272a] space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-300">Show topic labels</span>
                  <input
                    type="checkbox"
                    checked={settings.showLabels}
                    onChange={(e) => {
                      updateSetting('showLabels', e.target.checked);
                      requestRender();
                    }}
                    className="rounded bg-[#131315] border-[#27272a] accent-zinc-400 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-300">Fade text on zoom out</span>
                  <input
                    type="checkbox"
                    checked={settings.fadeLabelsOnZoom}
                    onChange={(e) => {
                      updateSetting('fadeLabelsOnZoom', e.target.checked);
                      requestRender();
                    }}
                    className="rounded bg-[#131315] border-[#27272a] accent-zinc-400 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-300">Show directional link arrows</span>
                  <input
                    type="checkbox"
                    checked={settings.showArrows}
                    onChange={(e) => {
                      updateSetting('showArrows', e.target.checked);
                      requestRender();
                    }}
                    className="rounded bg-[#131315] border-[#27272a] accent-zinc-400 focus:ring-0"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 4. FORCES TAB */}
          {activeSettingsTab === 'forces' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Node Spacing (Repulsion)</span>
                  <span className="font-mono">{settings.repulsion}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="360"
                  step="10"
                  value={settings.repulsion}
                  onChange={(e) => {
                    updateSetting('repulsion', parseInt(e.target.value, 10));
                    wakeSimulation(0.35);
                  }}
                  className="w-full accent-zinc-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Link Distance</span>
                  <span className="font-mono">{settings.linkDistance}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={settings.linkDistance}
                  onChange={(e) => {
                    updateSetting('linkDistance', parseInt(e.target.value, 10));
                    wakeSimulation(0.35);
                  }}
                  className="w-full accent-zinc-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Spring Strength</span>
                  <span className="font-mono">{settings.linkStrength.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.010"
                  max="0.070"
                  step="0.005"
                  value={settings.linkStrength}
                  onChange={(e) => {
                    updateSetting('linkStrength', parseFloat(e.target.value));
                    wakeSimulation(0.35);
                  }}
                  className="w-full accent-zinc-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Center Force</span>
                  <span className="font-mono">{settings.centerForce.toFixed(4)}</span>
                </div>
                <input
                  type="range"
                  min="0.0002"
                  max="0.0016"
                  step="0.0001"
                  value={settings.centerForce}
                  onChange={(e) => {
                    updateSetting('centerForce', parseFloat(e.target.value));
                    wakeSimulation(0.35);
                  }}
                  className="w-full accent-zinc-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                <button
                  onClick={() => wakeSimulation(0.5)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-300 hover:text-white hover:bg-[#202024] rounded"
                >
                  <Activity className="w-3 h-3" />
                  Relax layout
                </button>
                <button
                  onClick={() => {
                    setSettings(DEFAULT_SETTINGS);
                    saveStoredSettings(DEFAULT_SETTINGS);
                    wakeSimulation(0.4);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] text-zinc-500 hover:text-zinc-300 hover:bg-[#202024] rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                  Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unobtrusive Navigation Controls (Obsidian Desktop HUD, Repositioned to top-right on mobile to prevent bottom sheet collision) */}
      <div className="absolute top-12 right-2 sm:bottom-3 sm:right-3 sm:top-auto z-10 flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 bg-[#18181b]/90 border border-[#2b2b32] rounded-md p-1 shadow-md backdrop-blur-xs">
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            const cx = canvas ? canvas.width / 2 : window.innerWidth / 2;
            const cy = canvas ? canvas.height / 2 : window.innerHeight / 2;
            zoomAtPoint(1.22, cx, cy);
          }}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors touch-manipulation"
          title="Zoom in (+)"
          aria-label="Zoom in"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            const cx = canvas ? canvas.width / 2 : window.innerWidth / 2;
            const cy = canvas ? canvas.height / 2 : window.innerHeight / 2;
            zoomAtPoint(0.82, cx, cy);
          }}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors touch-manipulation"
          title="Zoom out (-)"
          aria-label="Zoom out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors touch-manipulation"
          title="Fit graph to view (F / 0)"
          aria-label="Fit graph to view"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetView}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#25252b] rounded transition-colors touch-manipulation"
          title="Restore 1:1 view (R)"
          aria-label="Restore 1:1 view"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        {selectedTopicId && (
          <button
            onClick={handleFocusSelected}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#25252b] rounded transition-colors touch-manipulation"
            title="Center on selected topic"
            aria-label="Center on selected topic"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="w-3 h-px sm:w-px sm:h-3 bg-[#2b2b32]" />
        <button
          onClick={() => {
            const next = !isPhysicsPausedByUser;
            setIsPhysicsPausedByUser(next);
            if (!next) wakeSimulation(0.35);
          }}
          className={`p-1.5 rounded transition-colors touch-manipulation ${
            isPhysicsPausedByUser ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={isPhysicsPausedByUser ? 'Resume physics simulation (Space)' : 'Freeze physics simulation (Space)'}
          aria-label="Toggle physics simulation"
        >
          {isPhysicsPausedByUser ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Desktop Selected Topic Bottom Bar: Clean, Unobtrusive (Obsidian Desktop Style) */}
      {selectedTopic && (
        <div className="hidden sm:flex absolute bottom-3 left-3 z-10 items-center gap-2.5 bg-[#18181b]/95 border border-[#2b2b32] rounded-md px-3 py-1.5 text-xs backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-200 shrink-0" />
            <span className="font-medium text-white truncate max-w-[180px] sm:max-w-[260px]">
              {selectedTopic.title}
            </span>
            <span className="text-zinc-500 text-[10px]">·</span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {activeConnectionsCount} {activeConnectionsCount === 1 ? 'connection' : 'connections'}
            </span>
          </div>

          <div className="w-px h-3.5 bg-[#2b2b32]" />

          <button
            onClick={() => onOpenNote(selectedTopic.id)}
            className="flex items-center gap-1.5 text-[11px] text-zinc-200 hover:text-white hover:underline font-medium"
            title="Open associated note (or press Enter / double-click)"
          >
            <BookOpen className="w-3 h-3" />
            <span>Open note</span>
            <span className="text-[9px] text-zinc-500 font-mono ml-0.5 hidden sm:inline">↵</span>
          </button>

          <button
            onClick={() => onSelectTopic('')}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 ml-1"
            title="Deselect topic (Esc)"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Mobile Selected Topic Slide-Up Bottom Sheet */}
      {selectedTopic && (
        <div className="flex sm:hidden absolute bottom-0 left-0 right-0 z-20 bg-[#18181b]/98 border-t border-[#2b2b32] rounded-t-xl px-4 py-3 shadow-2xl backdrop-blur-md flex-col gap-2.5 animate-in slide-in-from-bottom-4 duration-150">
          <div className="w-8 h-1 rounded-full bg-zinc-600 self-center mb-0.5" />
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                {FOLDER_LABELS[selectedTopic.folderId] || selectedTopic.category}
              </div>
              <h4 className="text-sm font-semibold text-white truncate">
                {selectedTopic.title}
              </h4>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {activeConnectionsCount} {activeConnectionsCount === 1 ? 'connection' : 'connections'}
                {selectedTopic.prerequisiteIds?.length ? ` · ${selectedTopic.prerequisiteIds.length} prerequisites` : ''}
              </div>
            </div>
            <button
              onClick={() => onSelectTopic('')}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-[#25252b] touch-manipulation"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onOpenNote(selectedTopic.id)}
              className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg bg-zinc-200 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm transition-colors touch-manipulation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Note</span>
            </button>
            <button
              onClick={handleFocusSelected}
              className="min-h-[44px] px-3.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#242428] hover:bg-[#2e2e34] text-zinc-200 text-xs border border-[#303038] transition-colors touch-manipulation"
              title="Center in Graph"
              aria-label="Center in Graph"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>
          </div>
        </div>
      )}

      {/* Subtle Hover Status Strip when no node is selected (Desktop only) */}
      {!selectedTopic && hoveredNode && (
        <div className="hidden sm:flex absolute bottom-3 left-3 z-10 items-center gap-2 bg-[#18181b]/90 border border-[#2b2b32] rounded px-2.5 py-1 text-[11px] text-zinc-400 backdrop-blur-xs pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span className="text-zinc-200 font-medium">{hoveredNode.topic.title}</span>
          <span>·</span>
          <span>{activeConnectionsCount} {activeConnectionsCount === 1 ? 'connection' : 'connections'}</span>
          <span>·</span>
          <span className="text-[10px] text-zinc-400">Click to open note in workspace</span>
        </div>
      )}

      {/* Alternative Grouped Topic List View Overlay (High density mobile navigation) */}
      {viewFormat === 'list' && (
        <div className="absolute inset-0 z-20 pt-12 pb-6 px-3 sm:px-6 overflow-y-auto bg-[#141416]/98 backdrop-blur-sm text-zinc-300">
          <div className="max-w-2xl mx-auto space-y-3 pb-8">
            <div className="flex items-center justify-between border-b border-[#242428] pb-2 mb-3">
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">Concept Catalog</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {filteredTopics.length} topics across {Object.keys(groupedTopics).length} modules
                </p>
              </div>
              <button
                onClick={() => setViewFormat('canvas')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#202025] hover:bg-[#282830] text-zinc-200 text-xs border border-[#2d2d34] transition-colors touch-manipulation"
              >
                <Network className="w-3 h-3 text-zinc-400" />
                <span>Return to Canvas</span>
              </button>
            </div>

            {Object.keys(groupedTopics).length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs italic">
                No concepts matching search query.
              </div>
            ) : (
              Object.entries(groupedTopics).map(([fId, folderTopics]) => {
                const folderColor = FOLDER_COLORS[fId] || '#71717a';
                const folderLabel = FOLDER_LABELS[fId] || fId;
                const learnedInFolder = folderTopics.filter(t => statuses[t.id] === 'learned').length;

                return (
                  <div key={fId} className="bg-[#18181b] border border-[#26262a] rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#161619] border-b border-[#232326]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: folderColor }} />
                        <span className="font-semibold text-xs text-zinc-200">{folderLabel}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {learnedInFolder}/{folderTopics.length} learned
                      </span>
                    </div>

                    <div className="divide-y divide-[#202024]">
                      {folderTopics.map(t => {
                        const st = statuses[t.id] || 'not_studied';
                        const isSelected = t.id === selectedTopicId;
                        const adj = fullAdjacencyMap.get(t.id);
                        const connCount = adj ? adj.all.size : 0;
                        const isMissingPrereq = missingPrerequisiteNodeIds?.has(t.id);

                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              onSelectTopic(t.id);
                              setViewFormat('canvas');
                            }}
                            className={`flex items-center justify-between p-2.5 sm:p-3 cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#222228]' : 'hover:bg-[#1b1b1e]'
                            }`}
                          >
                            <div className="min-w-0 pr-2 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-xs text-zinc-200">{t.title}</span>
                                {isMissingPrereq && (
                                  <span className="px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px]">
                                    Gap
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                                <span className="capitalize">{st.replace('_', ' ')}</span>
                                <span>·</span>
                                <span>{connCount} links</span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenNote(t.id);
                              }}
                              className="shrink-0 min-h-[30px] flex items-center gap-1 px-2.5 py-1 rounded bg-[#24242a] hover:bg-[#2d2d34] text-zinc-200 text-xs transition-colors touch-manipulation"
                              title="Open note"
                            >
                              <BookOpen className="w-3 h-3 text-zinc-400" />
                              <span>Open</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
