import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

interface FadeInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotate?: number;
  once?: boolean;
  amount?: number;
}

const FadeInView = ({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 30,
  x = 0,
  scale = 1,
  rotate = 0,
  once = true,
  amount = 0.2,
}: FadeInViewProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale, rotate }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;

/* ── Stagger Group ──────────────────────────────────────────── */

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}

const staggerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
};

const itemVariants: Variants = {
  hidden: (y: number) => ({ opacity: 0, y }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const StaggerGroup = ({
  children,
  className = '',
  stagger = 0.1,
  delay = 0,
  y = 25,
  once = true,
  amount = 0.15,
}: StaggerGroupProps) => {
  return (
    <motion.div
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      custom={stagger}
      style={{ '--stagger-delay': `${delay}s` } as React.CSSProperties}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants} custom={y}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants} custom={y}>{children}</motion.div>
      }
    </motion.div>
  );
};

/* ── Text Reveal (headline clip-path) ───────────────────────── */

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const TextReveal = ({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  duration = 0.8,
  once = true,
}: TextRevealProps) => {
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once, amount: 0.5 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {text}
    </MotionTag>
  );
};

/* ── Divider Reveal ─────────────────────────────────────────── */

interface DividerRevealProps {
  className?: string;
  delay?: number;
  once?: boolean;
}

export const DividerReveal = ({ className = '', delay = 0.3, once = true }: DividerRevealProps) => {
  return (
    <motion.div
      className={`w-full border-t border-accent ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once, amount: 0.5 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ transformOrigin: 'center' }}
    />
  );
};
