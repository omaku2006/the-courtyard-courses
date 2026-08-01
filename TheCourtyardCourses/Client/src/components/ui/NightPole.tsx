import type React from 'react';
import Pole from './Pole';

export default function NightPole({
  className,
  height = 600,
  width,
  fill = '#c9a86a',
}: {
  className?: string;
  height?: number | string;
  width?: number | string;
  fill?: string;
}) {
  // Random delay (0 thi -5 seconds)
  const randomDelay = -(Math.random() * 5).toFixed(2);
  const randomDuration = 4 + Math.random() * 3;
  return (
    <div
      className="lamp-wrapper"
      // CSS variable pass kari rahya chiye
      style={
        {
          '--lamp-delay': `${randomDelay}s`,
          '--lamp-duration': `${randomDuration}s`,
          '--pole-height': typeof height === 'number' ? `${height}px` : height,
        } as React.CSSProperties
      }
    >
      <Pole className={className} fill={fill} height={height} width={width} />
    </div>
  );
}
