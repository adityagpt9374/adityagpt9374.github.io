import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ParticleSceneProps {
  onNext: () => void;
}

const ParticleScene: React.FC<ParticleSceneProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create elegant floating particles with motion blur
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const speed = Math.random() * 4 + 3; // Speed affects blur intensity
      
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      
      // Elegant color palette
      const colors = ['#ec4899', '#f472b6', '#fbbf24', '#f59e0b', '#8b5cf6', '#a855f7'];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.3)';
      
      // Add motion blur based on speed
      const blurAmount = Math.min(speed * 0.8, 3); // Scale blur with speed, max 3px
      particle.style.filter = `blur(${blurAmount}px)`;
      
      // Add subtle trail effect with pseudo-element
      particle.style.position = 'relative';
      particle.style.setProperty('--trail-blur', `${blurAmount * 1.5}px`);
      particle.classList.add('particle-trail');
      
      particlesRef.current?.appendChild(particle);

      const horizontalDrift = (Math.random() - 0.5) * 200;
      
      gsap.to(particle, {
        y: -window.innerHeight - 100,
        x: `+=${horizontalDrift}`,
        rotation: 360,
        opacity: Math.random() * 0.7 + 0.3,
        duration: speed,
        ease: "none",
        // Animate motion blur during movement
        onStart: () => {
          gsap.to(particle, {
            filter: `blur(${blurAmount * 1.5}px)`,
            duration: 0.5,
            ease: "power2.out"
          });
        },
        onComplete: () => {
          particle.remove();
        }
      });

      // Add subtle scale animation for more dynamic feel
      gsap.to(particle, {
        scale: Math.random() * 0.5 + 0.8,
        duration: speed * 0.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: Math.floor(speed)
      });
    };

    // Create particles continuously
    const particleInterval = setInterval(createParticle, 80); // Slightly faster spawn

    // Animate text with modern timing
    const textTimeline = gsap.timeline({ delay: 0.5 });
    
    gsap.set(textRef.current?.children, { opacity: 0, y: 80, scale: 0.9 });
    
    textTimeline
      .to(textRef.current?.children[0], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)"
      })
      .to(textRef.current?.children[1], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .to(textRef.current?.children[2], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .call(() => {
        setTimeout(() => {
          clearInterval(particleInterval);
          onNext();
        }, 3000);
      });

    return () => {
      clearInterval(particleInterval);
      textTimeline.kill();
    };
  }, [onNext]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-white overflow-hidden"
    >
      {/* Particles Container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none"></div>
      
      {/* Modern Text Design */}
      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
        <h1 className="text-5xl md:text-8xl font-extralight text-gray-800 mb-8 text-center tracking-wide leading-tight">
          Every Moment
        </h1>
        <h2 className="text-4xl md:text-6xl font-light text-pink-600 mb-8 text-center tracking-wider">
          With You
        </h2>
        <h3 className="text-2xl md:text-4xl font-normal text-purple-600 text-center tracking-wide">
          Is Pure Magic ✨
        </h3>
      </div>

      <style jsx>{`
        .particle-trail::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 300%;
          background: inherit;
          border-radius: inherit;
          transform: translate(-50%, -50%);
          opacity: 0.3;
          filter: blur(var(--trail-blur));
          z-index: -1;
        }

        .particle-trail::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80%;
          height: 200%;
          background: inherit;
          border-radius: inherit;
          transform: translate(-50%, -50%);
          opacity: 0.5;
          filter: blur(calc(var(--trail-blur) * 0.7));
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default ParticleScene;