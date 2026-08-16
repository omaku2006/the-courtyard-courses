import React, { useId } from 'react';

const FENCE_PATH =
  'M16.0040003,6.04099989 L15.0315413,6.04099989 L15.016541,3 L13.547,0 L11.9680934,3 L11.9830937,6.04099989 L9.96200034,6.04099989 L9.942,3 L8.525,0 L7.007,3 L7.03000018,6.04099989 L4.97000018,6.04099989 L4.941,3 L3.524,0 L2.006,3 L2.02900018,6.04099989 L1.06200018,6.04099989 L1.06499997,7.01965332 L2.03199997,7.01965332 L2.044,12.051 L1.039,12 L1.039,13.0093994 L2.03199997,13.0093994 L2.032,16 L4.967,16 L4.96699997,13.0093994 L7.03000018,13.0093994 L7.03,16 L9.968,16 L9.9679999,13.0093994 L11.9830937,13.0093994 L11.9830937,16 L15.034541,16 L15.0155406,13.0093994 L15.9879996,13.0093994 L15.988,12 L15.015541,12 L15.0155406,7.01965332 L15.9889996,7.01965332 L16.0040003,6.04099989 Z M4.98399994,6.97216797 L7.04199994,6.97216797 L7.042,12.051 L4.96,12.051 L4.98399994,6.97216797 Z M12.068,12 L9.96,12 L9.949,6.928 L12.068,6.928 L12.068,12 L12.068,12 Z';

interface FenceProps {
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  spacing?: number;
  /** Pattern mode: fixed tile height (px). Use = container height to keep a single row (no second-row sliver). */
  tileHeight?: number;
}

const Fence: React.FC<FenceProps> = ({
  className,
  size = 24,
  width,
  height,
  color = 'var(--color-border)',
  style,
  fill = false,
  spacing = 0,
  tileHeight,
  ...props
}) => {
  const rawId = useId();
  const patternId = `fence-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  if (fill) {
    const tileSize = typeof size === 'number' ? size : 24;

    // ✅ FIX: Removed internal padding from scale calculation
    // The actual path drawing spans from X=1.039 to X=16.004 (width ~14.965)
    const effectiveWidth = 14.965;
    const glyphScale = tileSize / effectiveWidth;
    const offsetX = -1.039 * glyphScale; // Align start to X=0

    const tileW = tileSize + spacing;
    const tileH = tileHeight ?? tileSize + spacing;

    return (
      <svg
        className={['si-glyph si-glyph-fence', className].filter(Boolean).join(' ')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'block',
          ...style,
        }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={patternId} width={tileW} height={tileH} patternUnits="userSpaceOnUse">
            <g
              // ✅ FIX: Translate X to remove left gap, making fences connect seamlessly
              transform={`translate(${spacing / 2 + offsetX} ${spacing / 2}) scale(${glyphScale})`}
              fill={color}
              stroke="none"
            >
              <path d={FENCE_PATH} />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    );
  }

  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 -0.5 17 17"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={['si-glyph si-glyph-fence', className].filter(Boolean).join(' ')}
      fill={color}
      style={style}
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <title>fence</title>
        <defs />
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path d={FENCE_PATH} fill={color} className="si-glyph-fill" />
        </g>
      </g>
    </svg>
  );
};

export default Fence;
export { Fence };
