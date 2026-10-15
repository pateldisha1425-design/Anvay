import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseSwipeToCloseOptions {
  /**
   * The direction in which the swipe closes the drawer:
   * - 'left': Drawer is on the left; dragging left (negative deltaX) closes it.
   * - 'right': Drawer is on the right; dragging right (positive deltaX) closes it.
   */
  direction: 'left' | 'right';
  /**
   * Whether the drawer is currently open.
   */
  isOpen: boolean;
  /**
   * Callback invoked when the user exceeds the swipe-to-close threshold or flick velocity.
   */
  onClose: () => void;
  /**
   * Minimum drag distance in pixels to trigger close (default: 60px).
   */
  threshold?: number;
  /**
   * Minimum flick velocity in px/ms to trigger close (default: 0.35 px/ms).
   */
  velocityThreshold?: number;
  /**
   * Whether touch tracking is enabled (e.g. only on mobile devices).
   */
  enabled?: boolean;
}

export function useSwipeToClose({
  direction,
  isOpen,
  onClose,
  threshold = 60,
  velocityThreshold = 0.35,
  enabled = true
}: UseSwipeToCloseOptions) {
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lockRef = useRef<'horizontal' | 'vertical' | null>(null);
  const currentOffsetRef = useRef<number>(0);
  const lastTouchRef = useRef<{ x: number; time: number } | null>(null);

  // Reset state when drawer closes or opens
  useEffect(() => {
    if (!isOpen) {
      setDragOffset(0);
      setIsDragging(false);
      touchStartRef.current = null;
      lockRef.current = null;
      currentOffsetRef.current = 0;
      lastTouchRef.current = null;
    }
  }, [isOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!enabled || !isOpen || e.touches.length !== 1) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: performance.now()
    };
    lastTouchRef.current = {
      x: touch.clientX,
      time: performance.now()
    };
    lockRef.current = null;
    currentOffsetRef.current = 0;
  }, [enabled, isOpen]);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!enabled || !isOpen || !touchStartRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Disambiguate gesture direction during initial movement (slop threshold 8px)
    if (lockRef.current === null) {
      const distance = Math.hypot(deltaX, deltaY);
      if (distance > 8) {
        if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
          lockRef.current = 'horizontal';
          setIsDragging(true);
        } else {
          lockRef.current = 'vertical';
          return;
        }
      } else {
        return;
      }
    }

    if (lockRef.current !== 'horizontal') return;

    // Calculate offset with elastic resistance for over-pulling
    let offset = 0;
    if (direction === 'left') {
      // Swiping left (deltaX < 0) closes the drawer
      if (deltaX <= 0) {
        offset = deltaX;
      } else {
        // Elastic resistance when dragging right past open boundary
        offset = Math.pow(deltaX, 0.75);
      }
    } else {
      // Swiping right (deltaX > 0) closes the drawer
      if (deltaX >= 0) {
        offset = deltaX;
      } else {
        // Elastic resistance when dragging left past open boundary
        offset = -Math.pow(Math.abs(deltaX), 0.75);
      }
    }

    currentOffsetRef.current = offset;
    setDragOffset(offset);
    lastTouchRef.current = {
      x: touch.clientX,
      time: performance.now()
    };
  }, [direction, enabled, isOpen]);

  const handleTouchEnd = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!enabled || !isOpen || !touchStartRef.current) return;

    if (lockRef.current === 'horizontal') {
      const now = performance.now();
      const finalOffset = currentOffsetRef.current;
      const duration = Math.max(1, now - touchStartRef.current.time);
      const totalDeltaX = (lastTouchRef.current?.x ?? touchStartRef.current.x) - touchStartRef.current.x;
      const velocity = totalDeltaX / duration; // px/ms

      let shouldClose = false;

      if (direction === 'left') {
        // Closed if dragged left past threshold OR swiped fast left
        const passedDistance = finalOffset < -threshold;
        const passedVelocity = velocity < -velocityThreshold;
        if (passedDistance || passedVelocity) {
          shouldClose = true;
        }
      } else {
        // Closed if dragged right past threshold OR swiped fast right
        const passedDistance = finalOffset > threshold;
        const passedVelocity = velocity > velocityThreshold;
        if (passedDistance || passedVelocity) {
          shouldClose = true;
        }
      }

      if (shouldClose) {
        onClose();
      }
    }

    // Reset interaction state
    touchStartRef.current = null;
    lastTouchRef.current = null;
    lockRef.current = null;
    currentOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  }, [direction, enabled, isOpen, onClose, threshold, velocityThreshold]);

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
    lastTouchRef.current = null;
    lockRef.current = null;
    currentOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  // Compute backdrop opacity multiplier based on drag progress towards closing
  const estimatedDrawerWidth = 280;
  const progress = Math.min(1, Math.max(0, Math.abs(dragOffset) / estimatedDrawerWidth));
  const backdropOpacityMultiplier = isDragging ? Math.max(0.1, 1 - progress * 0.8) : 1;

  const containerStyle: React.CSSProperties = {
    transform: dragOffset !== 0 ? `translate3d(${dragOffset}px, 0, 0)` : undefined,
    transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: isDragging ? 'transform' : 'auto'
  };

  return {
    dragOffset,
    isDragging,
    backdropOpacityMultiplier,
    containerStyle,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    }
  };
}
