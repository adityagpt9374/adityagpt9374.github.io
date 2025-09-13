import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { gsap } from 'gsap';
import CouplePhoto from '../imgs/together1.jpg'; // Add your couple photo here

interface PhotoSceneProps {
  onNext: () => void;
}

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(to bottom right, #fdf2f8, #ffffff, #faf5ff);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
`;

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(2deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
`;

// Styled Components
const SceneContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #fdf2f8, #ffffff, #faf5ff);
  overflow: hidden;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const EffectsContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
`;

const PhotoContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
  z-index: 20;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    transform: scale(0.8);
  }

  @media (max-width: 480px) {
    transform: scale(0.7);
  }
`;

const PhotoFrame = styled.div`
  width: 320px;
  height: 320px;
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #ec4899, #8b5cf6, #06b6d4, #ec4899);
    border-radius: 26px;
    z-index: -1;
    opacity: 0.1;
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  position: relative;
  z-index: 1;
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 20px;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05),
    transparent
  );
  border-radius: 16px;
  pointer-events: none;
`;

const CornerAccent = styled.div<{ $position: string; $color: string }>`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: ${float} 3s ease-in-out infinite;
  background: ${({ $color }) => $color};
  
  ${({ $position }) => {
    switch ($position) {
      case 'top-left': return css`top: -6px; left: -6px;`;
      case 'top-right': return css`top: -6px; right: -6px; animation-delay: 0.5s;`;
      case 'bottom-left': return css`bottom: -6px; left: -6px; animation-delay: 1s;`;
      case 'bottom-right': return css`bottom: -6px; right: -6px; animation-delay: 1.5s;`;
      default: return css``;
    }
  }}
`;

const TextContainer = styled.div`
  text-align: center;
  max-width: 600px;
  z-index: 20;
  position: relative;

  @media (max-width: 768px) {
    max-width: 500px;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    max-width: 350px;
  }
`;

const MainTitle = styled.h1`
  font-size: 4rem;
  font-weight: 100;
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: 0.05em;
  opacity: 0;
  transform: translateY(100px) scale(0.8);

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 200;
  color: #ec4899;
  margin-bottom: 2rem;
  line-height: 1.3;
  letter-spacing: 0.1em;
  opacity: 0;
  transform: translateY(100px) scale(0.8);

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const PhotoScene: React.FC<PhotoSceneProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);

  const createSplashEffects = () => {
    if (!effectsRef.current) return;

    // Create colorful splash circles like welcome scene
    const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    
    const splashConfig = [
      { 
        x: window.innerWidth * 0.25, 
        y: window.innerHeight * 0.3, 
        color: 'rgba(236, 72, 153, 0.08)',
        maxSize: screenDiagonal * 1.2
      },
      { 
        x: window.innerWidth * 0.75, 
        y: window.innerHeight * 0.7, 
        color: 'rgba(139, 92, 246, 0.08)',
        maxSize: screenDiagonal * 1.3
      },
      { 
        x: window.innerWidth * 0.5, 
        y: window.innerHeight * 0.15, 
        color: 'rgba(6, 182, 212, 0.08)',
        maxSize: screenDiagonal * 1.1
      }
    ];

    splashConfig.forEach((config, index) => {
      const circle = document.createElement('div');
      circle.style.position = 'absolute';
      circle.style.pointerEvents = 'none';
      circle.style.width = '50px';
      circle.style.height = '50px';
      circle.style.backgroundColor = config.color;
      circle.style.borderRadius = '50%';
      circle.style.left = (config.x - 25) + 'px';
      circle.style.top = (config.y - 25) + 'px';
      circle.style.filter = 'blur(2px)';
      
      effectsRef.current?.appendChild(circle);
      
      // Initial setup
      gsap.set(circle, { opacity: 0, scale: 0 });
      
      // Create splash effect like welcome scene
      const splashTl = gsap.timeline({ repeat: -1, delay: index * 1.5 });
      
      splashTl
        .to(circle, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(circle, {
          scale: config.maxSize / 50,
          opacity: 0,
          duration: 3,
          ease: "power1.out"
        })
        .to(circle, {
          scale: 0,
          duration: 0.05
        });

      // Floating motion
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

  const createFloatingHearts = () => {
    if (!effectsRef.current) return;

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💖', '💕', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.position = 'absolute';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        heart.style.zIndex = '5';
        
        effectsRef.current?.appendChild(heart);

        // Float up animation
        gsap.to(heart, {
          y: -window.innerHeight - 100,
          x: `+=${(Math.random() - 0.5) * 200}`,
          rotation: Math.random() * 360,
          duration: Math.random() * 4 + 3,
          ease: "power1.out",
          onComplete: () => heart.remove()
        });

        // Fade out
        gsap.to(heart, {
          opacity: 0,
          duration: 1,
          delay: 2
        });
      }, i * 800);
    }
  };

  useEffect(() => {
    if (!photoRef.current || !textRef.current) return;

    // Initial setup
    gsap.set(photoRef.current, { scale: 0, rotation: -15, y: 100, opacity: 0 });

    const tl = gsap.timeline();

    // Photo entrance with bounce
    tl.to(photoRef.current, {
      scale: 1,
      rotation: 0,
      y: 0,
      opacity: 1,
      duration: 2,
      ease: "elastic.out(1, 0.5)"
    });

    // Start background effects
    tl.call(() => {
      createSplashEffects();
      createFloatingHearts();
    }, null, 0.5);

    // Text animations like welcome scene - staggered entrance
    tl.to(textRef.current?.children[0], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)"
    }, "-=1")
    .to(textRef.current?.children[1], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.6)"
    }, "-=0.8");

    // Final transition
    tl.call(() => {
      setTimeout(() => onNext(), 4000);
    }, null, "+=2");

    return () => {
      tl.kill();
    };
  }, [onNext]);

  return (
    <SceneContainer ref={containerRef}>
      <GlobalStyle />
      <EffectsContainer ref={effectsRef} />

      <PhotoContainer ref={photoRef}>
        <PhotoFrame>
          <PhotoImage 
            src={CouplePhoto} 
            alt="Beautiful couple photo"
            onError={(e) => {
              // Fallback if image doesn't load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div style="
                  width: 100%; 
                  height: 100%; 
                  background: linear-gradient(45deg, #ec4899, #8b5cf6); 
                  border-radius: 16px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  font-size: 4rem;
                ">💕</div>
              `;
            }}
          />
          <PhotoOverlay />
        </PhotoFrame>
        
        <CornerAccent $position="top-left" $color="linear-gradient(45deg, #ec4899, #f472b6)" />
        <CornerAccent $position="top-right" $color="linear-gradient(45deg, #8b5cf6, #a78bfa)" />
        <CornerAccent $position="bottom-left" $color="linear-gradient(45deg, #06b6d4, #22d3ee)" />
        <CornerAccent $position="bottom-right" $color="linear-gradient(45deg, #f59e0b, #fbbf24)" />
      </PhotoContainer>

      <TextContainer ref={textRef}>
        <MainTitle>Here's Our First Year Together</MainTitle>
        <SubTitle>I LOVE YOUUU</SubTitle>
      </TextContainer>
    </SceneContainer>
  );
};

export default PhotoScene;