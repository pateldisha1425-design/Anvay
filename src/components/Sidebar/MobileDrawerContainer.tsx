import React from 'react';
import { useSwipeToClose } from '../../hooks/useSwipeToClose';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileDrawerContainerProps {
  isOpen: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  isMobile: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Tailwind classes or custom width for the drawer on desktop.
   */
  desktopWidthClass?: string;
}

export const MobileDrawerContainer: React.FC<MobileDrawerContainerProps> = ({
  isOpen,
  onClose,
  side,
  isMobile,
  title,
  children,
  className = '',
  desktopWidthClass = 'w-60 sm:w-64'
}) => {
  // Swipe direction: left side closes when swiping left, right side closes when swiping right
  const swipeDirection = side === 'left' ? 'left' : 'right';

  const {
    isDragging,
    backdropOpacityMultiplier,
    containerStyle,
    touchHandlers
  } = useSwipeToClose({
    direction: swipeDirection,
    isOpen: isMobile && isOpen,
    onClose,
    threshold: 55,
    velocityThreshold: 0.35,
    enabled: isMobile
  });

  if (!isOpen) {
    return null;
  }

  // Desktop Rendering: Standard inline panel, no drawer or backdrop
  if (!isMobile) {
    return (
      <aside
        className={`${desktopWidthClass} shrink-0 h-full overflow-hidden ${
          side === 'left' ? 'border-r' : 'border-l'
        } border-[#232326] z-20 bg-[#18181a] ${className}`}
      >
        {children}
      </aside>
    );
  }

  // Mobile / Tablet Rendering: Responsive Overlay Drawer with Gesture Drag & Backdrop
  return (
    <>
      {/* Backdrop Scrim */}
      <div
        onClick={onClose}
        style={{
          opacity: 0.65 * backdropOpacityMultiplier,
          transition: isDragging ? 'none' : 'opacity 200ms ease-out'
        }}
        className="fixed inset-0 top-8 bottom-6 bg-black z-30 pointer-events-auto backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        {...touchHandlers}
        style={containerStyle}
        className={`fixed top-8 bottom-6 z-40 bg-[#18181a] border-[#27272b] shadow-2xl flex flex-col overflow-hidden touch-pan-y ${
          side === 'left'
            ? 'left-10 sm:left-11 border-r border-t-0 border-b-0 w-[calc(100vw-3rem)] max-w-xs sm:w-80 rounded-r-xl'
            : 'right-0 border-l border-t-0 border-b-0 w-[calc(100vw-2.75rem)] max-w-xs sm:w-84 rounded-l-xl'
        } ${className}`}
      >
        {/* Mobile Drawer Header with Swipe Hint & Dismiss Target */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#232326] bg-[#141416]/95 shrink-0 select-none">
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            {side === 'left' && <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 animate-pulse shrink-0" />}
            <span className="text-xs font-semibold text-zinc-200 truncate">
              {title || (side === 'left' ? 'Navigation' : 'Details')}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tight shrink-0 hidden xs:inline">
              {side === 'left' ? '· Swipe ← to close' : '· Swipe → to close'}
            </span>
            {side === 'right' && <ChevronRight className="w-3.5 h-3.5 text-zinc-500 animate-pulse shrink-0" />}
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-[#232328] transition-colors touch-manipulation"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edge Drag Pill Affordance */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center ${
            side === 'left' ? 'right-1' : 'left-1'
          }`}
          aria-hidden="true"
        >
          <div className="w-1 h-10 rounded-full bg-zinc-600/70 shadow-sm" />
        </div>

        {/* Inner Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </aside>
    </>
  );
};
