import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { lighten, darken } from 'polished';
import { gsap } from 'gsap';
import Balloon1 from '../imgs/ballon1.png'
import Balloon2 from '../imgs/ballon2.png'
import Balloon3 from '../imgs/ballon3.png'

interface CakeSceneProps {
  onNext: () => void;
}

// SCSS variables converted to JS constants
const vanilla = '#f0e4d0';
const chocolate = '#553c13';
const candleColor = '#7B020B';
const plateColor = '#ccc';

// Global styles for the body background and font
const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(to bottom right, #fdf2f8, #ffffff, #faf5ff);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
`;

// Text animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// SCSS @mixin converted to a reusable JS function using css helper
const foodColoring = (color: string) => css`
  background-color: ${color};
  box-shadow:
    0 2px 0px ${lighten(0.05, color)},
    0 4px 0px ${darken(0.082, color)},
    0 6px 0px ${darken(0.084, color)},
    0 8px 0px ${darken(0.086, color)},
    0 10px 0px ${darken(0.088, color)},
    0 12px 0px ${darken(0.09, color)},
    0 14px 0px ${darken(0.094, color)},
    0 16px 0px ${darken(0.094, color)},
    0 18px 0px ${darken(0.096, color)},
    0 20px 0px ${darken(0.098, color)},
    0 22px 0px ${darken(0.1, color)},
    0 24px 0px ${darken(0.102, color)},
    0 26px 0px ${darken(0.104, color)},
    0 28px 0px ${darken(0.106, color)},
    0 30px 0px ${darken(0.108, color)};
`;

// SCSS @keyframes converted to styled-components keyframes
const flicker = keyframes`
  0% {
    transform: skewX(5deg);
    box-shadow: 0 0 10px rgba(255,165,0,0.2), 0 0 20px rgba(255,165,0,0.2), 0 0 60px rgba(255,165,0,0.2), 0 0 80px rgba(255,165,0,0.2);
  }
  25% {
    transform: skewX(-5deg);
    box-shadow: 0 0 10px rgba(255,165,0,0.5), 0 0 20px rgba(255,165,0,0.5), 0 0 60px rgba(255,165,0,0.5), 0 0 80px rgba(255,165,0,0.5);
  }
  50% {
    transform: skewX(10deg);
    box-shadow: 0 0 10px rgba(255,165,0,0.3), 0 0 20px rgba(255,165,0,0.3), 0 0 60px rgba(255,165,0,0.3), 0 0 80px rgba(255,165,0,0.3);
  }
  75% {
    transform: skewX(-10deg);
    box-shadow: 0 0 10px rgba(255,165,0,0.4), 0 0 20px rgba(255,165,0,0.4), 0 0 60px rgba(255,165,0,0.4), 0 0 80px rgba(255,165,0,0.4);
  }
  100% {
    transform: skewX(5deg);
    box-shadow: 0 0 10px rgba(255,165,0,0.5), 0 0 20px rgba(255,165,0,0.5), 0 0 60px rgba(255,165,0,0.5), 0 0 80px rgba(255,165,0,0.5);
  }
`;

// Styled components for each element
const SceneContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #fdf2f8, #ffffff, #faf5ff);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const CakeContainer = styled.div`
  position: relative;
  width: 250px;
  height: 200px;
  z-index: 15;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 200px;
    height: 160px;
    margin-bottom: 1.5rem;
    transform: scale(0.8);
  }

  @media (max-width: 480px) {
    width: 180px;
    height: 144px;
    margin-bottom: 1rem;
    transform: scale(0.7);
  }

  /* This targets all direct children, same as .cake > * */
  > * {
    position: absolute;
  }
`;

const Plate = styled.div`
  width: 270px;
  height: 110px;
  position: absolute;
  bottom: -10px;
  left: -10px;
  background-color: ${plateColor};
  border-radius: 50%;
  box-shadow:
    0 2px 0 ${darken(0.1, plateColor)},
    0 4px 0 ${darken(0.1, plateColor)},
    0 5px 40px rgba(0, 0, 0, 0.5);
`;

const Layer = styled.div`
  display: block;
  width: 250px;
  height: 100px;
  border-radius: 50%;
  ${foodColoring(chocolate)}
`;

const LayerTop = styled(Layer)`
  top: 0px;
`;

const LayerMiddle = styled(Layer)`
  top: 33px;
`;

const LayerBottom = styled(Layer)`
  top: 66px;
`;

const Icing = styled.div`
  top: 2px;
  left: 5px;
  background-color: ${vanilla};
  width: 240px;
  height: 90px;
  border-radius: 50%;

  &::before {
    content: "";
    position: absolute;
    top: 4px;
    right: 5px;
    bottom: 6px;
    left: 5px;
    background-color: ${lighten(0.03, vanilla)};
    box-shadow:
      0 0 4px ${lighten(0.05, vanilla)},
      0 0 4px ${lighten(0.05, vanilla)},
      0 0 4px ${lighten(0.05, vanilla)};
    border-radius: 50%;
    z-index: 1;
  }
`;

const Drip = styled.div`
  display: block;
  width: 50px;
  height: 60px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  background-color: ${vanilla};
`;

const Drip1 = styled(Drip)`
  top: 53px;
  left: 5px;
  transform: skewY(15deg);
  height: 48px;
  width: 40px;
`;

const Drip2 = styled(Drip)`
  top: 69px;
  left: 181px;
  transform: skewY(-15deg);
`;

const Drip3 = styled(Drip)`
  top: 54px;
  left: 90px;
  width: 80px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
`;

const Candle = styled.div`
  background-color: ${candleColor};
  width: 16px;
  height: 50px;
  border-radius: 8px / 4px;
  top: -20px;
  left: 50%;
  margin-left: -8px;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 8px;
    border-radius: 50%;
    background-color: ${lighten(0.1, candleColor)};
  }
`;

const Flame = styled.div`
  position: absolute;
  background-color: orange;
  width: 15px;
  height: 35px;
  border-radius: 10px 10px 10px 10px / 25px 25px 10px 10px;
  top: -34px;
  left: 50%;
  margin-left: -7.5px;
  z-index: 10;
  box-shadow:
    0 0 10px rgba(255,165,0, 0.5),
    0 0 20px rgba(255,165,0, 0.5),
    0 0 60px rgba(255,165,0, 0.5),
    0 0 80px rgba(255,165,0, 0.5);
  transform-origin: 50% 90%;
  animation: ${flicker} 1s ease-in-out alternate infinite;
`;

const Instructions = styled.div`
  text-align: center;
  color: #374151;
  font-size: 20px;
  font-weight: 500;
  z-index: 30;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }

  p {
    margin: 8px 0;
    animation: ${fadeInUp} 0.8s ease-out forwards;
    
    &:first-child {
      font-size: 24px;
      font-weight: 600;
      color: #d97706;
      animation: ${fadeInUp} 0.8s ease-out forwards, ${bounce} 2s ease-in-out 1s infinite;

      @media (max-width: 768px) {
        font-size: 22px;
      }

      @media (max-width: 480px) {
        font-size: 20px;
      }
    }

    &:last-child {
      animation-delay: 0.3s;
      color: #6b7280;
      font-weight: 400;
    }
  }
`;

const CutButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 30;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  animation: ${fadeInUp} 1s ease-out 0.6s forwards;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
    min-width: 160px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
    min-width: 140px;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    
    &:hover {
      transform: none;
    }
  }
`;

const EffectsContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
`;

// The final component that assembles all the parts
const CakeScene: React.FC<CakeSceneProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);
  const [isCutting, setIsCutting] = useState(false);

  const createSplashCircles = () => {
    if (!effectsRef.current) return;

    // Calculate screen diagonal for full coverage
    const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    
    // Create splash circles similar to WelcomeScreen
    const splashConfig = [
      { 
        x: window.innerWidth * 0.25, 
        y: window.innerHeight * 0.3, 
        color: 'rgba(236, 72, 153, 0.15)',
        maxSize: screenDiagonal * 1.2
      },
      { 
        x: window.innerWidth * 0.75, 
        y: window.innerHeight * 0.7, 
        color: 'rgba(139, 69, 19, 0.15)',
        maxSize: screenDiagonal * 1.3
      },
      { 
        x: window.innerWidth * 0.5, 
        y: window.innerHeight * 0.15, 
        color: 'rgba(245, 158, 11, 0.15)',
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
      
      // Create splash effect
      const splashTl = gsap.timeline({ delay: index * 0.2 });
      
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
          duration: 2.5,
          ease: "power1.out"
        })
        .call(() => {
          circle.remove();
        });
    });
  };

  const createBalloons = () => {
    if (!effectsRef.current) return;

    // Array of balloon images
    const balloonImages = [Balloon1, Balloon2, Balloon3];

    // Create 15 balloons with random images
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const balloon = document.createElement('img');
        // Randomly select one of the 3 balloon images
        balloon.src = balloonImages[Math.floor(Math.random() * balloonImages.length)];
        balloon.alt = 'balloon';
        balloon.style.position = 'absolute';
        balloon.style.pointerEvents = 'none';
        balloon.style.width = (Math.random() * 80 + 200) + 'px'; // Much bigger size: 80-160px
        balloon.style.height = 'auto';
        balloon.style.left = Math.random() * window.innerWidth + 'px';
        balloon.style.top = window.innerHeight + 50 + 'px';
        balloon.style.zIndex = '10'; // Lower than cake (15) and button (30)
        balloon.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // Random colors
        
        effectsRef.current?.appendChild(balloon);

        // Straight balloon animation (no rotation)
        gsap.to(balloon, {
          y: -window.innerHeight - 200,
          x: `+=${(Math.random() - 0.5) * 300}`, // More horizontal spread for bigger balloons
          duration: Math.random() * 2.5 + 3, // Slower: 3-5.5 seconds for bigger balloons
          ease: "power2.out",
          onComplete: () => {
            balloon.remove();
          }
        });

        // Gentle floating motion (no rotation)
        gsap.to(balloon, {
          x: `+=${Math.random() * 80 - 40}`,
          duration: Math.random() * 2 + 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }, i * 120); // Slightly longer stagger for bigger balloons
    }
  };

  const cutTheCake = () => {
    if (isCutting) return;
    
    setIsCutting(true);

    // Start splash effects immediately
    createSplashCircles();
    
    // Start balloons after a short delay
    setTimeout(() => {
      createBalloons();
    }, 500);

    // Move to next scene after effects
    setTimeout(() => {
      onNext();
    }, 4000);
  };

  useEffect(() => {
    return () => {
      // Cleanup any ongoing animations
      if (effectsRef.current) {
        effectsRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <SceneContainer ref={containerRef}>
      <GlobalStyle />
      <EffectsContainer ref={effectsRef} />
      <CakeContainer>
        <Plate />
        <LayerBottom />
        <LayerMiddle />
        <LayerTop />
        <Icing />
        <Drip1 />
        <Drip2 />
        <Drip3 />
        <Candle />
        <Flame />
      </CakeContainer>

      <Instructions>
        <p>🎂 I Cooked An Anniversary Cake For You! 🎂</p>
        <p>Make a wish and cut the cake bb...</p>
      </Instructions>

      <CutButton onClick={cutTheCake} disabled={isCutting}>
        {isCutting ? '🔪 Cutting...' : '🔪 Cut the Cake!'}
      </CutButton>
    </SceneContainer>
  );
};

export default CakeScene;