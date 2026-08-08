import { motion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';

type MagicTextProps = {
  loop?: boolean;
  both?: boolean;
  glowColor?: string;
  textColor?: string;
  animationDuration?: number;
  holdingDuration?: number;
  welding?: boolean;
  text: string;
  onCycleComplete?: () => void; // 🔥 NEW
};

const MagicTextInOut = ({
  loop = true,
  both = true,
  glowColor = '#c9a86a',
  textColor = '#000',
  welding = false,
  animationDuration = 2,
  holdingDuration = 3,
  text,
  onCycleComplete,
}: MagicTextProps) => {
  const resetDuration = 0.15;

  // Total cycle time in ms
  const cycleDurationMs = both
    ? (animationDuration + holdingDuration) * 2 * 1000
    : (animationDuration + holdingDuration + resetDuration) * 1000;

  // Callback ref so interval doesn't reset on every render
  const callbackRef = useRef(onCycleComplete);
  callbackRef.current = onCycleComplete;

  // 🔥 Fire callback exactly when each cycle completes
  useEffect(() => {
    if (!callbackRef.current || !loop) return;

    const interval = setInterval(() => {
      callbackRef.current?.();
    }, cycleDurationMs);

    return () => clearInterval(interval);
  }, [cycleDurationMs, loop]);

  // Width keyframes
  const widthKeyframes = both ? ['0%', '100%', '100%', '0%', '0%'] : ['0%', '100%', '100%', '0%'];

  const totalDurationSec = cycleDurationMs / 1000;

  const widthTimes = both
    ? [
        0,
        animationDuration / totalDurationSec,
        (animationDuration + holdingDuration) / totalDurationSec,
        (animationDuration * 2 + holdingDuration) / totalDurationSec,
        1,
      ]
    : [
        0,
        animationDuration / totalDurationSec,
        (animationDuration + holdingDuration) / totalDurationSec,
        1,
      ];

  const transition = {
    duration: totalDurationSec,
    times: widthTimes,
    repeat: loop ? Infinity : 0,
    ease: 'easeInOut' as const,
  };

  // Sparks
  const sparks = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.7) * 90,
        y: (Math.random() - 0.95) * 90,
        scale: Math.random() * 0.8 + 0.3,
        delay: Math.random() * animationDuration * 0.7,
        duration: Math.random() * 0.5 + 0.25,
      })),
    [animationDuration]
  );

  return (
    <div className="relative inline-block">
      {/* TEXT LAYER - overflow hidden so text clips */}
      <motion.div
        className="relative overflow-hidden whitespace-nowrap"
        initial={{ width: '0%' }}
        animate={{ width: widthKeyframes }}
        transition={transition}
      >
        <span
          className="inline-block whitespace-nowrap text-2xl font-bold"
          style={{ color: textColor }}
        >
          {text}
        </span>
      </motion.div>

      {/* EFFECTS LAYER - NO overflow, sparks fly freely */}
      <motion.div
        className="absolute top-0 left-0 h-full pointer-events-none"
        initial={{ width: '0%' }}
        animate={{ width: widthKeyframes }}
        transition={transition}
      >
        {/* Glowing cursor */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[3px]"
          style={{
            backgroundColor: glowColor,
            boxShadow: `
              0 0 10px 2px ${glowColor},
              0 0 25px 8px ${glowColor},
              0 0 60px 15px ${glowColor}55,
              -20px 0 50px 20px ${glowColor}40,
              0 0 120px 30px ${glowColor}25
            `,
          }}
        />

        {/* Welding sparks */}
        {welding && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: '#fff',
                  boxShadow: `0 0 8px 3px ${glowColor}, 0 0 20px 8px ${glowColor}90`,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: [0, spark.x * 0.3, spark.x],
                  y: [0, spark.y * 0.3, spark.y + 25],
                  opacity: [0, 1, 0],
                  scale: [0.2, spark.scale, 0],
                }}
                transition={{
                  duration: spark.duration,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MagicTextInOut;
