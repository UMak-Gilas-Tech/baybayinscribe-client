"use client";

import React, { useEffect, useState } from "react";

export function ScreenSize() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = (width: number) => {
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 640) return 'sm';
    return 'base';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm flex gap-2 items-center z-50">
      <span>{dimensions.width} x {dimensions.height}px</span>
      <span className="w-px h-4 bg-white/20" />
      <span className="text-teal-400">{getBreakpoint(dimensions.width)}</span>
    </div>
  );
} 