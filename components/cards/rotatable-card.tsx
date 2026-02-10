'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';

interface RotatableCardProps {
  children: ReactNode;
  className?: string;
}

export function RotatableCard({ children, className }: RotatableCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startRotation = useRef({ x: 0, y: 0 });

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      startPos.current = { x: clientX, y: clientY };
      startRotation.current = { ...rotation };
    },
    [rotation],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const deltaX = clientX - startPos.current.x;
      const deltaY = clientY - startPos.current.y;

      const newRotationY = startRotation.current.y + deltaX * 0.5;
      const newRotationX = startRotation.current.x - deltaY * 0.3;

      const clampedX = Math.max(-30, Math.min(30, newRotationX));

      setRotation({
        x: clampedX,
        y: newRotationY,
      });
    },
    [isDragging],
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  return (
    <div
      className={className}
      style={{ perspective: '1000px' }}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      <div
        ref={cardRef}
        className="cursor-grab select-none active:cursor-grabbing"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
