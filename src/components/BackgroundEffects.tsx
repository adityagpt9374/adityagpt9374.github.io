import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BackgroundEffects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.className = 'absolute rounded-full pointer-events-none';
      
      // Random size and position
      const size = Math.random() * 60 + 20;
      element.style.width = size + 'px';
      element.style.height = size + 'px';
      element.style.left = Math.random() * window.innerWidth + 'px';
      element.style.top = window.innerHeight + 'px';
      
      // Subtle colors for white background
      const colors = [
        'rgba(236, 72, 153, 0.1)',
        'rgba(147, 51, 234, 0.1)',
        'rgba(59, 130, 246, 0.1)',
        'rgba(16, 185, 129, 0.1)',
        'rgba(245, 158, 11, 0.1)'
      ];
      element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      element.style.backdropFilter = 'blur(10px)';
      
      containerRef.current?.appendChild(element);

      // Elegant floating animation
      gsap.to(element, {
        y: -window.innerHeight - 100,
        x: `+=${(Math.random() - 0.5) * 300}`,
        rotation: 360,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 8 + 6,
        ease: "none",
        onComplete: () => {
          element.remove();
        }
      });
    };

    // Create floating elements at intervals
    const elementInterval = setInterval(createFloatingElement, 2000);

    return () => {
      clearInterval(elementInterval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
    ></div>
  );
};

export default BackgroundEffects;