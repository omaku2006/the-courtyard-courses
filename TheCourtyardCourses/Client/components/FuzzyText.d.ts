import type { ReactNode } from 'react';

export interface FuzzyTextProps {
  children?: ReactNode;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: 'horizontal' | 'vertical';
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: { from: string; to: string } | null;
  letterSpacing?: number;
  className?: string;
}

declare const FuzzyText: (props: FuzzyTextProps) => ReactNode;
export default FuzzyText;
