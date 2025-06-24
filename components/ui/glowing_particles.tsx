"use client";
import { useEffect, useRef } from "react";

const GlowingParticlesSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = 400; // adjust as needed
    canvas.width = width;
    canvas.height = height;

    const particles: {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
    }[] = [];

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 230, 0, 0.6)";
        ctx.shadowColor = "#ffee00";
        ctx.shadowBlur = 8;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-screen h-[400px] bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>

      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-center h-full text-center">
        <div className="text-white space-y-3">
          <h2 className="text-3xl font-bold">No Nonsense. Search. Scroll. Tap.</h2>
          <p className="text-gray-300">
            Time is a luxury. Spend it where it matters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlowingParticlesSection;
