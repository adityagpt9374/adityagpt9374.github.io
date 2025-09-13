import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import HelloKitty from '../imgs/hellokitty.gif'

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Initial setup
    gsap.set([textRef.current?.children, gifRef.current], { 
      opacity: 0, 
      y: 100,
      scale: 0.8
    });

    // Animation sequence
    tl.to(gifRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.6)"
    })
    .to(textRef.current?.children[0], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)"
    }, "-=0.8")
    .to(textRef.current?.children[1], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.6)"
    }, "-=0.8")
    .call(() => {
      setTimeout(onNext, 3000);
    });

    // Create dynamic motion graphics
    createDynamicMotionGraphics();

    return () => {
      tl.kill();
    };
  }, [onNext]);

  const createDynamicMotionGraphics = () => {
    if (!motionRef.current) return;

    // Clear any existing elements first
    motionRef.current.innerHTML = '';

    // Create splash circles only
    createSplashCircles();
  };

  const createSplashCircles = () => {
    // Calculate screen diagonal for full coverage
    const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    
    // Now 3 main splash circles with full screen coverage
    const splashConfig = [
      { 
        x: window.innerWidth * 0.25, 
        y: window.innerHeight * 0.3, 
        color: 'rgba(147, 51, 234, 0.08)',
        maxSize: screenDiagonal * 1.2 // Covers entire screen plus extra
      },
      { 
        x: window.innerWidth * 0.75, 
        y: window.innerHeight * 0.7, 
        color: 'rgba(59, 130, 246, 0.08)',
        maxSize: screenDiagonal * 1.3 // Even bigger coverage
      },
      { 
        x: window.innerWidth * 0.5, 
        y: window.innerHeight * 0.15, 
        color: 'rgba(16, 185, 129, 0.08)',
        maxSize: screenDiagonal * 1.1 // Full screen coverage
      }
    ];

    splashConfig.forEach((config, index) => {
      const circle = document.createElement('div');
      circle.className = 'absolute pointer-events-none';
      
      circle.style.width = '50px';
      circle.style.height = '50px';
      circle.style.backgroundColor = config.color;
      circle.style.borderRadius = '50%';
      circle.style.left = (config.x - 25) + 'px';
      circle.style.top = (config.y - 25) + 'px';
      circle.style.filter = 'blur(2px)';
      
      motionRef.current?.appendChild(circle);
      
      // Initial setup
      gsap.set(circle, { opacity: 0, scale: 0 });
      
      // Create faster splash effect - start small and grow to cover entire screen
      const splashTl = gsap.timeline({ repeat: -1, delay: index * 1.5 });
      
      splashTl
        .to(circle, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(circle, {
          scale: config.maxSize / 50, // Scale to cover entire screen
          opacity: 0,
          duration: 3,
          ease: "power1.out"
        })
        .to(circle, {
          scale: 0,
          duration: 0.05
        });

      // Faster floating motion while splashing
      gsap.to(circle, {
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        duration: 2.5 + (index * 0.3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 1.5
      });
    });
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden"
    >
      {/* Motion Graphics Background */}
      <div ref={motionRef} className="absolute inset-0 pointer-events-none z-0"></div>

      {/* Main Content - Reduced top margin */}
      <div className="text-center z-10 relative -mt-12">
        {/* GIF Animation - Smaller margin bottom */}
        <img 
          ref={gifRef}
          src={HelloKitty}
          alt="Welcome Animation"
          className="w-32 h-32 md:w-44 md:h-44 mb-6 mx-auto rounded-full shadow-lg border-4 border-white/50"
        />
        
        {/* Text Content - Increased font sizes */}
        <div ref={textRef}>
          <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-thin text-gray-800 mb-4 tracking-wider leading-tight drop-shadow-sm">
            Hello
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-pink-600 tracking-[0.3em] opacity-90 drop-shadow-sm">
            Cutiepiee
          </h2>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
