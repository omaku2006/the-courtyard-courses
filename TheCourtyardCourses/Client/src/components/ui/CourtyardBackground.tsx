import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import DayPole from './DayPole';
import NightPole from './NightPole';

const IMAGE_WIDTH = 1980;
const IMAGE_HEIGHT = 1080;

const poles = [
  { x: 55, y: 1100, height: 1100 },
  { x: 360, y: 1085, height: 850 },
  { x: 590, y: 1030, height: 600 },
  { x: 715, y: 970, height: 420 },
  { x: 800, y: 920, height: 280 },
  { x: 860, y: 890, height: 190 },
  { x: 900, y: 865, height: 130 },
  { x: 925, y: 850, height: 95 },
  { x: 945, y: 842, height: 70 },
  { x: 959, y: 833, height: 50 },

  { x: 1925, y: 1100, height: 1100 },
  { x: 1630, y: 1085, height: 850 },
  { x: 1430, y: 1030, height: 600 },
  { x: 1305, y: 970, height: 420 },
  { x: 1210, y: 920, height: 280 },
  { x: 1160, y: 890, height: 190 },
  { x: 1115, y: 865, height: 130 },
  { x: 1088, y: 850, height: 95 },
  { x: 1072, y: 842, height: 70 },
  { x: 1060, y: 833, height: 50 },
];

export default function CourtyardBackground() {
  const theme = useAppSelector((state) => state.theme.mode);

  const Pole = theme === 'dark' ? NightPole : DayPole;

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resize = () =>
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  const cover = useMemo(() => {
    const scale = Math.max(viewport.width / IMAGE_WIDTH, viewport.height / IMAGE_HEIGHT);

    const renderWidth = IMAGE_WIDTH * scale;
    const renderHeight = IMAGE_HEIGHT * scale;

    const offsetX = (viewport.width - renderWidth) / 2;
    const offsetY = (viewport.height - renderHeight) / 2;

    return {
      scale,
      offsetX,
      offsetY,
    };
  }, [viewport]);

  return (
    <div className="fixed inset-0 overflow-hidden z-10">
      <img
        src={theme === 'dark' ? '/courtyardBgNight.png' : '/courtyardBg.png'}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {poles.map((pole, index) => (
        <div
          key={index}
          className="fixed z-20"
          style={{
            left: cover.offsetX + pole.x * cover.scale,
            top: cover.offsetY + pole.y * cover.scale,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <Pole height={pole.height * cover.scale} />
        </div>
      ))}
    </div>
  );
}
