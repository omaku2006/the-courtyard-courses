import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';

import DayPole from './DayPole';
import NightPole from './NightPole';
import Fog from './Fog';

const WORLD_WIDTH = 1980;
const WORLD_HEIGHT = 1080;

const poles = [
  // LEFT
  { x: 55, y: 1100, height: 1100 },
  { x: 360, y: 1020, height: 850 },
  { x: 590, y: 938, height: 590 },
  { x: 715, y: 885, height: 420 },
  { x: 800, y: 845, height: 280 },
  { x: 860, y: 820, height: 190 },
  { x: 900, y: 804, height: 130 },
  { x: 925, y: 792, height: 95 },
  { x: 945, y: 783, height: 70 },
  { x: 959, y: 778, height: 50 },

  // RIGHT
  { x: 1925, y: 1100, height: 1100 },
  { x: 1630, y: 1020, height: 850 },
  { x: 1430, y: 938, height: 590 },
  { x: 1305, y: 885, height: 420 },
  { x: 1210, y: 845, height: 280 },
  { x: 1160, y: 820, height: 190 },
  { x: 1115, y: 804, height: 130 },
  { x: 1088, y: 792, height: 95 },
  { x: 1072, y: 783, height: 70 },
  { x: 1060, y: 778, height: 50 },
];

export default function CourtyardBackground() {
  const theme = useAppSelector((state) => state.theme.mode);

  const Pole = theme === 'dark' ? NightPole : DayPole;

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scale = useMemo(() => {
    return Math.max(viewport.width / WORLD_WIDTH, viewport.height / WORLD_HEIGHT);
  }, [viewport]);

  return (
    <div className="fixed inset-0 overflow-hidden z-10">
      {/* Camera */}

      {theme === 'dark' && <Fog />}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,

          transform: `
            translate(-50%, -50%)
            scale(${scale})
          `,

          willChange: 'transform',
          transformOrigin: 'center center',
        }}
      >
        {/* Background */}

        <img
          src={theme === 'dark' ? '/courtyardBgNight.jpg' : '/courtyardBg.jpg'}
          alt=""
          draggable={false}
          loading="eager"
          decoding="async"
          className={`
            ${theme === 'dark' ? 'brightness-90' : 'brightness-110'}
            absolute
            inset-0
            w-full
            h-full
            select-none
            pointer-events-none
            `}
        />

        {/* Poles */}

        {poles.map((pole, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: pole.x,
              top: pole.y,

              transform: 'translate(-50%, -100%)',
              transformOrigin: 'bottom center',
            }}
          >
            <Pole height={pole.height} className={theme === 'dark' ? 'lamp-glow-intense' : ''} />
          </div>
        ))}
      </div>
    </div>
  );
}
