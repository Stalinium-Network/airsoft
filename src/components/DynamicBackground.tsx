"use client";

import { useEffect, useRef } from 'react';

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      alpha: number;
    }[] = [];
    
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 10);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          color: Math.random() > 0.6 ? '#10B981' : '#6B7280',
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
      
      requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      createParticles();
    };
    
    window.addEventListener('resize', handleResize);
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
