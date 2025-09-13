import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface DarkRoomProps {
  onNext: () => void;
}

const DarkRoom: React.FC<DarkRoomProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bulbRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wireRef = useRef<HTMLDivElement>(null);
  const bulbSystemRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const [isLit, setIsLit] = useState(false);

  useEffect(() => {
    // Initial setup with dark background
    gsap.set(containerRef.current, { backgroundColor: "#1a1a1a" });
    
    // Hide entire bulb system initially
    gsap.set(bulbSystemRef.current, { opacity: 0 });
    gsap.set(bulbRef.current, { y: -300, opacity: 0, scale: 0.7, rotation: -10 });
    gsap.set(lightRef.current, { opacity: 0, scale: 0 });
    
    // Set button initial state
    gsap.set(buttonRef.current, { opacity: 0, scale: 0.5, y: 100 });
    
    // Set instructions initial state
    gsap.set(instructionsRef.current, { opacity: 0, y: 30, scale: 0.8 });

    // Button entrance animation
    gsap.to(buttonRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.6)",
      delay: 0.5
    });

    // Instructions entrance animation
    gsap.to(instructionsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "back.out(1.7)",
      delay: 1.5
    });

    return () => {
      // Cleanup any running animations
      gsap.killTweensOf([buttonRef.current, instructionsRef.current]);
    };
  }, []);

  const lightUpRoom = () => {
    if (isLit) return;
    
    setIsLit(true);
    const tl = gsap.timeline();

    // Enhanced button click effect
    tl.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1
    })
    .to(buttonRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: "back.out(2)"
    })
    // Hide instructions with enhanced animation
    .to(instructionsRef.current, {
      opacity: 0,
      y: -30,
      scale: 0.7,
      rotation: -5,
      duration: 0.5,
      ease: "back.in(2)"
    }, "-=0.1")
    // Make button disappear when bulb starts appearing
    .to(buttonRef.current, {
      opacity: 0,
      scale: 0,
      y: -50,
      rotation: 180,
      duration: 0.8,
      ease: "back.in(2)"
    }, "+=0.1")
    // Show bulb system
    .to(bulbSystemRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3")
    // Wire swinging animation
    .to(wireRef.current, {
      rotation: 4,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(wireRef.current, {
      rotation: -3,
      duration: 0.5,
      ease: "power2.inOut"
    })
    .to(wireRef.current, {
      rotation: 0,
      duration: 0.6,
      ease: "power2.out"
    })
    // Enhanced bulb dropping animation
    .to(bulbRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 2.5,
      ease: "elastic.out(1.2, 0.5)"
    }, "-=1.2")
    // Bulb subtle swing after dropping
    .to(bulbRef.current, {
      rotation: 3,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(bulbRef.current, {
      rotation: -2,
      duration: 0.6,
      ease: "power2.inOut"
    })
    .to(bulbRef.current, {
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    })
    // Light flickering effect
    .to(lightRef.current, {
      opacity: 0.2,
      scale: 0.3,
      duration: 0.1,
      ease: "power2.out"
    }, "-=1.5")
    .to(lightRef.current, {
      opacity: 0,
      duration: 0.1
    })
    .to(lightRef.current, {
      opacity: 0.4,
      scale: 0.6,
      duration: 0.2,
      ease: "power2.out"
    })
    .to(lightRef.current, {
      opacity: 0.1,
      duration: 0.1
    })
    .to(lightRef.current, {
      opacity: 0.9,
      scale: 1.5,
      duration: 1.2,
      ease: "power2.out"
    })
    // Room illumination with warm transition
    .to(containerRef.current, {
      backgroundColor: "#fff8e1",
      duration: 2.0,
      ease: "power2.out"
    }, "-=2")
    // Make bulb system disappear when room is fully lit
    .to(bulbSystemRef.current, {
      opacity: 0,
      scale: 0.8,
      y: -100,
      duration: 1.2,
      ease: "power2.in"
    }, "-=0.5")
    // Enhanced sparkle effects
    .call(() => {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => createSparkle(), i * 80);
      }
    }, null, "-=1")
    // Proceed to next scene
    .call(() => {
      setTimeout(onNext, 2500);
    });
  };

  const createSparkle = () => {
    const sparkle = document.createElement('div');
    sparkle.className = 'absolute pointer-events-none';
    
    // Random sparkle shapes
    const shapes = ['⭐', '✨', '💫', '🌟'];
    sparkle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
    sparkle.style.fontSize = (Math.random() * 16 + 12) + 'px';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.zIndex = '100';
    
    containerRef.current?.appendChild(sparkle);

    gsap.fromTo(sparkle, 
      { 
        scale: 0, 
        opacity: 1,
        rotation: 0,
        y: 0
      },
      {
        scale: 1.5,
        opacity: 0,
        rotation: 360,
        y: -40,
        duration: 1.8,
        ease: "power2.out",
        onComplete: () => {
          sparkle.remove();
        }
      }
    );
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
    >
      {/* Hanging Bulb System - Initially Hidden */}
      <div ref={bulbSystemRef} className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
        {/* Enhanced Wire */}
        <div 
          ref={wireRef}
          className="w-2 h-48 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 mx-auto shadow-lg rounded-full"
          style={{ transformOrigin: 'top center' }}
        ></div>
        
        {/* Enhanced Bulb Container */}
        <div ref={bulbRef} className="relative" style={{ transformOrigin: 'top center' }}>
          {/* Bulb Socket */}
          <div className="w-12 h-10 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-t-xl mx-auto shadow-xl border border-gray-500">
            <div className="w-full h-1 bg-gray-500 mt-2 rounded"></div>
            <div className="w-full h-1 bg-gray-500 mt-1 rounded"></div>
            <div className="w-full h-1 bg-gray-500 mt-1 rounded"></div>
          </div>
          
          {/* Enhanced Bulb Shape */}
          <div className="w-24 h-28 bg-gradient-to-b from-gray-50 via-white to-yellow-50 mx-auto relative overflow-hidden shadow-2xl border-2 border-gray-200"
               style={{ 
                 borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                 clipPath: 'ellipse(90% 100% at 50% 50%)'
               }}>
            {/* Enhanced Filament Design */}
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-10 h-12 border-2 border-orange-600 rounded-full opacity-60"></div>
                <div className="absolute top-1 left-1 w-8 h-10 border border-orange-700 rounded-full opacity-40"></div>
                {/* Center support */}
                <div className="absolute top-0 left-1/2 w-0.5 h-12 bg-gray-600 transform -translate-x-1/2"></div>
                {/* Connection wires */}
                <div className="absolute -top-2 left-1/2 w-0.5 h-4 bg-gray-600 transform -translate-x-1/2"></div>
                <div className="absolute -bottom-2 left-1/2 w-0.5 h-4 bg-gray-600 transform -translate-x-1/2"></div>
              </div>
            </div>
            
            {/* Glass reflection */}
            <div className="absolute top-2 left-2 w-6 h-8 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full blur-sm"></div>
          </div>
          
          {/* Enhanced Light Effect */}
          <div 
            ref={lightRef}
            className="absolute -inset-48 bg-gradient-radial from-yellow-200 via-yellow-100 via-orange-50 to-transparent rounded-full blur-3xl"
          ></div>
        </div>
      </div>

      {/* Enhanced Button */}
      <button
        ref={buttonRef}
        onClick={lightUpRoom}
        className="relative px-12 py-6 text-black font-bold text-xl rounded-2xl shadow-lg border-2 border-yellow-200 overflow-hidden group mb-8 z-50 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #FFFF00 0%, #FFD700 50%, #FFA500 100%)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.7)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 pointer-events-none"></div>
        
        {/* Button text */}
        <div className="relative z-10 font-bold flex items-center justify-center gap-3 w-full h-full pointer-events-none">
          <span>💡</span>
          <span>LIGHT UP THE ROOM</span>
        </div>
      </button>

      {/* Enhanced Instruction text */}
      <div ref={instructionsRef} className="text-center z-40">
        <p 
          className="text-white text-lg mb-3 font-medium" 
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
        >
          Click the button above to illuminate the room
        </p>
        <div 
          className="text-yellow-400 text-3xl"
          style={{
            animation: 'bounce 2s infinite',
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))'
          }}
        >
          ☝️
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -10px, 0);
          }
          70% {
            transform: translate3d(0, -5px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default DarkRoom;