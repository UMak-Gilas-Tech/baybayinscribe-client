import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphicCard = ({
  children,
  className,
}: GlassmorphicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateCardRect = () => {
      if (cardRef.current) {
        setCardRect(cardRef.current.getBoundingClientRect());
      }
    };

    updateCardRect();
    window.addEventListener("resize", updateCardRect);
    return () => window.removeEventListener("resize", updateCardRect);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRect) return;

    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-400/20 before:to-purple-400/20 before:opacity-50",
        "after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-transparent after:opacity-30",
        className
      )}
    >
      {/* Dynamic reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
