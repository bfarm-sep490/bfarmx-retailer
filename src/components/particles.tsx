'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_RGB = [34, 197, 94];

type XY = {
  x: number;
  y: number;
};

const MousePosition = (): XY => {
  const [mousePosition, setMousePosition] = useState<XY>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => setMousePosition({ x: event.clientX, y: event.clientY });
    globalThis.addEventListener('mousemove', handleMouseMove);
    return () => globalThis.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};
const remapValue = (value: number, beg1: number, end1: number, beg2: number, end2: number) =>
  Math.max(0, ((value - beg1) * (end2 - beg2)) / (end1 - beg1) + beg2);

type Circle = {
  alpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  size: number;
  targetAlpha: number;
  translateX: number;
  translateY: number;
  x: number;
  y: number;
};

type ParticlesProps = {
  className?: string;
  ease?: number;
  pSize?: number;
  quantity?: number;
  refresh?: boolean;
  rgb?: number[];
  staticity?: number;
  vx?: number;
  vy?: number;
};

const Particles: React.FC<ParticlesProps> = ({
  className,
  ease = 30,
  pSize = 1,
  quantity = 200,
  refresh = false,
  rgb = DEFAULT_RGB,
  staticity = 20,
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ h: number; w: number }>({ h: 0, w: 0 });
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
  const [mounted, setMounted] = useState(false);
  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { h, w } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };
  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;

      const rect = canvasContainerRef.current.getBoundingClientRect();
      canvasSize.current.w = rect.width;
      canvasSize.current.h = rect.height;

      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };
  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const psize = Math.floor(Math.random() * 1.5) + pSize;
    const alpha = 0;
    const targetAlpha = Number.parseFloat((Math.random() * 0.4 + 0.2).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.05;
    const dy = (Math.random() - 0.5) * 0.05;
    const magnetism = 0.2 + Math.random() * 3;
    return {
      alpha,
      dx,
      dy,
      magnetism,
      size: psize,
      targetAlpha,
      translateX,
      translateY,
      x,
      y,
    };
  };
  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { alpha, size, translateX, translateY, x, y } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!update) {
        circles.current.push(circle);
      }
    }
  };
  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };
  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i += 1) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };
  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };
  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = Number.parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        circle.alpha = Math.min(circle.alpha, circle.targetAlpha);
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;
      drawCircle(circle, true);
      if (
        circle.x < -circle.size
        || circle.x > canvasSize.current.w + circle.size
        || circle.y < -circle.size
        || circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    globalThis.requestAnimationFrame(animate);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }

    const resizeObserver = new ResizeObserver(() => {
      initCanvas();
    });

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    initCanvas();
    animate();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  // Handle mouse movement
  useEffect(() => {
    if (mounted) {
      onMouseMove();
    }
  }, [mousePosition.x, mousePosition.y, mounted]);

  // Handle refresh prop changes
  useEffect(() => {
    if (mounted) {
      initCanvas();
    }
  }, [refresh, mounted]);

  return (
    <div className={cn('-z-10 absolute inset-0', className)} ref={canvasContainerRef}>
      <canvas className="size-full" ref={canvasRef} />
    </div>
  );
};

export default Particles;
