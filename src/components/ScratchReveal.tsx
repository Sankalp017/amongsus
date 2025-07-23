import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ScratchRevealProps {
  children: React.ReactNode; // The content to be revealed
  onRevealStart: () => void; // Callback when scratching begins
  className?: string;
}

const ScratchReveal: React.FC<ScratchRevealProps> = ({ children, onRevealStart, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [hasStartedRevealing, setHasStartedRevealing] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out'; // This makes new drawings erase existing pixels

    // Draw a circle for the initial touch/click point
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, false); // Adjust radius for scratch size
    ctx.fill();

    // Draw a line from the last point to the current point for continuous scratching
    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = 40; // Adjust line width for scratch size
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    lastPoint.current = { x, y };
  }, []);

  const getEventCoords = useCallback((event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else { // TouchEvent
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const handleStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault(); // Prevent scrolling on touch devices
    setIsScratching(true);
    if (!hasStartedRevealing) {
      setHasStartedRevealing(true);
      onRevealStart(); // Notify parent that scratching has started
    }
    const { x, y } = getEventCoords(event.nativeEvent);
    lastPoint.current = { x, y };
    draw(x, y);
  }, [draw, getEventCoords, onRevealStart, hasStartedRevealing]);

  const handleMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    event.preventDefault();
    const { x, y } = getEventCoords(event.nativeEvent);
    draw(x, y);
  }, [isScratching, draw, getEventCoords]);

  const handleEnd = useCallback(() => {
    setIsScratching(false);
    lastPoint.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to set canvas dimensions and draw the initial cover
    const setCanvasDimensionsAndDrawCover = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear previous drawings and draw the new cover
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over'; // Reset to default for drawing cover
      ctx.fillStyle = 'rgba(139, 92, 246, 0.9)'; // A purple shade for the scratch layer
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Initial setup
    setCanvasDimensionsAndDrawCover();

    // Handle resize events to redraw the cover if the canvas size changes
    window.addEventListener('resize', setCanvasDimensionsAndDrawCover);

    return () => {
      window.removeEventListener('resize', setCanvasDimensionsAndDrawCover);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className={cn("relative w-full h-64 rounded-3xl overflow-hidden", className)}>
      {/* Content to be revealed (the word) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {children}
      </div>

      {/* Scratchable overlay canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd} // End scratching if mouse leaves canvas
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
      />
      {!hasStartedRevealing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xl md:text-2xl font-bold text-white z-10">
            Scratch to Reveal
          </span>
        </div>
      )}
    </div>
  );
};

export default ScratchReveal;