# Straight Connection Lines in Knowledge Graph

Switch graph connection lines from organic curved Bézier curves to crisp, clean straight lines, removing dynamic flex while preserving smooth force-directed physics and gliding camera transitions.

> [!IMPORTANT]
> **Confirmed Direction**: 
> - Revert connection links from curved quadratic Bézier arcs back to direct straight line segments (`lineTo`).
> - Remove perpendicular curvature offsets and dynamic node velocity flex calculations (`velFlex`, `dynamicOffset`).
> - Update directional arrowhead rendering to point directly along the straight connection vector into target node perimeters.
> - Fully preserve all silky physics motion (soft collision cushioning, spring responsiveness, viscous damping, smooth settling) and camera zoom/pan interpolation.

---

### 1. Overview & Core Concept
- **What It Does**: Renders note relationships and prerequisite connections in the knowledge graph using straight lines instead of curved arcs.
- **Key Value**: Provides a minimalist, distraction-free architectural graph aesthetic that makes connection paths and network hierarchies immediately readable, while maintaining fluid node movement and responsive cursor navigation.
- **Target Experience**: Clean Obsidian-style network visualization with instant visual clarity between related functional materials topics.

---

### 2. User Experience & Visual Design
- **Line Rendering**:
  - Direct straight line segments connecting source $(x_s, y_s)$ to target $(x_t, y_t)$ centers.
  - Active and hovered connections highlighted with bright high-contrast stroke (`#ffffff`) and enhanced line weight.
  - Non-connected edges dimmed to 40% opacity (`#383842`) when a topic or node is focused, maintaining the calibrated visual hierarchy.
  - Default resting edges rendered in subtle graphite (`#2c2d33`) with configurable stroke thickness (`settings.linkThickness`).
- **Directional Arrowheads**:
  - When `settings.showArrows` is enabled (for prerequisite relationships), draw crisp triangular arrowheads aligned along the straight vector $(\Delta x, \Delta y)$ positioned exactly at the boundary of the target node ($r_{\text{target}} + \text{offset}$).
- **Interactive Motion**:
  - Dragging nodes remains fluid and spring-connected: neighbor nodes follow dynamically without edge warping.
  - Camera zoom, fit-to-screen, and reset-view continue using buttery 60fps lerp transitions.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Vector Arrowheads vs. Tangent Angles**
  - *Chosen Approach*: Compute straight-line angle $\theta = \operatorname{atan2}(y_t - y_s, x_t - x_s)$ and place the arrow head at $(x_t - (r + \delta)\cos\theta, y_t - (r + \delta)\sin\theta)$.
  - *Why*: Eliminates complex control-point quadratic curve math and ensures arrowheads point directly along the line of sight into the node's edge.
  - *Alternatives Considered*: Retaining control points for slight bends was rejected per user direction for straight lines.

- **Decision 2: Removal of Dynamic Flex Calculations**
  - *Chosen Approach*: Remove velocity projection math (`avgVx * nx + avgVy * ny`) and hash-based curve variance from the render loop.
  - *Why*: Eliminates unnecessary per-frame vector arithmetic during canvas redraws, maximizing frame rates during rapid panning, zooming, and node dragging.

---

### 4. Technical Architecture & Render Pipeline

```
  ┌────────────────────────────────────────────────────────┐
  │                 GraphView.tsx Canvas                   │
  └──────────────────────────┬─────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌───────────────────┐             ┌───────────────────┐
   │ Force Simulation  │             │   Canvas Render   │
   │ (Tick Loop)       │             │   (drawCanvas)    │
   ├───────────────────┤             ├───────────────────┤
   │ • Hooke's Springs │             │ 1. Straight Lines │
   │ • Soft Repulsion  │             │    moveTo(s.x,s.y)│
   │ • Viscous Damping │             │    lineTo(t.x,t.y)│
   │ • Camera Lerp     │             │ 2. Straight Arrows│
   └───────────────────┘             │ 3. Nodes & Labels │
                                     └───────────────────┘
```

#### Detailed Code Changes in `src/components/Graph/GraphView.tsx`:
1. **Remove Curved Arrow Helper**:
   - Replace `drawCurvedArrowHead(ctx, cpX, cpY, ...)` with a streamlined `drawArrowHead(ctx, fromX, fromY, toX, toY, targetRadius, scale, color)`.
2. **Streamline Edge Loop in `drawCanvas`**:
   - Remove `pairKey`, hash calculation, `baseCurve`, `velFlex`, and `cpX/cpY` control points.
   - Replace `ctx.quadraticCurveTo(cpX, cpY, t.x, t.y)` with clean `ctx.lineTo(t.x, t.y)`.
   - Update arrow call to pass straight vector coordinates.
3. **Verify Settings & Controls**:
   - Ensure the Link Thickness and Show Arrows toggles in the Graph Settings drawer continue to control straight lines seamlessly.

---

## Verification Plan

### Automated Checks
- `compile_applet`: Verify clean TypeScript compilation without unused variables or type mismatches.
- `lint_applet`: Verify zero ESLint warnings or errors.

### Manual Verification Scenarios
- **Straight Lines**: Verify all edges between notes render as clean, straight lines without curves or bends.
- **Dynamic Flex Removed**: Verify edges stay rigid between node centers without bulging or flexing during node drags.
- **Directional Arrows**: Enable "Show arrows" and verify prerequisite edges show arrows aligned along the straight line at the node perimeter.
- **Physics & Motion Integrity**: Drag nodes to confirm spring attraction, soft repulsion, and smooth settling remain active and smooth.
- **Dimming & Highlighting**: Click or hover a node to confirm connected straight edges stay white/bright while unrelated edges dim to 40%.
