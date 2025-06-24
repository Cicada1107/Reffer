"use client";
import { useEffect, useRef } from "react";
import { Button } from "./button";

const GlowingParticlesSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = 400;
    };
    setCanvasSize();

    const particles = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
    }));

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 230, 0, 0.6)";
        ctx.shadowColor = "#ffee00";
        ctx.shadowBlur = 8;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });

        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
    }, []);


  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-[100%] h-full"
      ></canvas>

      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-center h-full text-center">
        <div className="text-white space-y-3">
          <h2 className="text-3xl font-bold">No Nonsense. Search. Scroll. Tap.</h2>
          <p className="text-gray-300">
            Time is a luxury. Spend it where it matters.
          </p>
          <Button variant={"secondary"}>Try It Now</Button>
        </div>
      </div>
    </div>
  );
};

export default GlowingParticlesSection;
