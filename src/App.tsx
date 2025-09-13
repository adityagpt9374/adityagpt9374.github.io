import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import WelcomeScreen from './components/WelcomeScreen';
import DarkRoom from './components/DarkRoom';
import ParticleScene from './components/ParticleScene';
import CakeScene from './components/CakeScene';
import PhotoScene from './components/PhotoScene';
import BackgroundEffects from './components/BackgroundEffects';

function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const appRef = useRef<HTMLDivElement>(null);

  const scenes = [
    { component: WelcomeScreen, name: 'welcome' },
    { component: DarkRoom, name: 'darkroom' },
    { component: ParticleScene, name: 'particles' },
    { component: CakeScene, name: 'cake' },
    { component: PhotoScene, name: 'photo' }
  ];

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      const tl = gsap.timeline();
      tl.to(appRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      })
      .call(() => setCurrentScene(currentScene + 1))
      .to(appRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  };

  useEffect(() => {
    gsap.set(appRef.current, { opacity: 1 });
  }, []);

  const CurrentSceneComponent = scenes[currentScene].component;

  return (
    <div ref={appRef} className="relative w-full h-screen overflow-hidden bg-white">
      <BackgroundEffects />
      <CurrentSceneComponent onNext={nextScene} />
    </div>
  );
}

export default App;