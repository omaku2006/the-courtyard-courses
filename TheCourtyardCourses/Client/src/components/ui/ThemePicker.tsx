import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, PaletteIcon } from '@phosphor-icons/react';
import type { CSSProperties } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTheme } from '../../features/themes/themeSlice';
import type { ThemeMode } from '../../features/themes/themeSlice';

const THEMES: { mode: ThemeMode; label: string; colors: [string, string, string] }[] = [
  { mode: 'light', label: 'Victorian Day', colors: ['#f5eddf', '#ede4d0', '#c9a86a'] },
  { mode: 'light2', label: 'Old Parchment', colors: ['#efefdf', '#e3e3d3', '#8b6b46'] },
  { mode: 'dark', label: 'Lamplight', colors: ['#1f1e1c', '#3d3a34', '#8c7b63'] },
  { mode: 'dark2', label: 'Midnight Court', colors: ['#1c232b', '#3e4a56', '#a9927d'] },
];

type Placement = 'bottom-left' | 'bottom-right' | 'right-start';

interface ThemePickerProps {
  /** Where the popup should try to anchor relative to the trigger */
  placement?: Placement;
  /** Extra classes for the trigger button (grid layouts in sidebar etc.) */
  triggerClassName?: string;
  /** Palette icon size */
  iconSize?: number;
  /** Render the "Theme" label next to the icon (sidebar style) */
  withLabel?: boolean;
}

const MARGIN = 12;

export default function ThemePicker({
  placement = 'bottom-right',
  triggerClassName = 'p-2 text-text hover:text-primary transition-colors',
  iconSize = 24,
  withLabel = false,
}: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  /** Position the fixed popup near the trigger, clamped inside the viewport */
  const place = useCallback(() => {
    const btn = btnRef.current;
    const pop = popRef.current;
    if (!btn || !pop) return;
    const r = btn.getBoundingClientRect();
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;

    let top: number;
    let left: number;
    if (placement === 'right-start') {
      top = r.top;
      left = r.right + MARGIN;
    } else {
      top = r.bottom + MARGIN;
      left = placement === 'bottom-right' ? r.right - pw : r.left;
    }
    top = Math.min(Math.max(MARGIN, top), window.innerHeight - ph - MARGIN);
    left = Math.min(Math.max(MARGIN, left), window.innerWidth - pw - MARGIN);

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
  }, [placement]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useLayoutEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !popRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  const pick = (mode: ThemeMode) => {
    dispatch(setTheme(mode));
    setOpen(false);
  };

  return (
    <div className="contents">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`cursor-pointer ${triggerClassName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose theme"
      >
        <PaletteIcon size={iconSize} weight="fill" />
        {withLabel && <h6 className="italic text-nowrap ml-3">Theme</h6>}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popRef}
              role="menu"
              style={{ position: 'fixed', zIndex: 90 } as CSSProperties}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="w-64 bg-surface border-2 border-border rounded-sm shadow-[6px_6px_0_var(--color-border)] p-2"
            >
              <p className="m-0 px-2 pt-1 pb-2 font-heading text-[10px] uppercase tracking-[0.18em] text-text-muted border-b border-border/50">
                Select Theme
              </p>

              <div className="flex flex-col gap-1 pt-2">
                {THEMES.map((t) => {
                  const active = theme === t.mode;
                  return (
                    <button
                      key={t.mode}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      onClick={() => pick(t.mode)}
                      className={`flex items-center gap-3 px-2 py-2 rounded-sm text-left cursor-pointer transition-colors ${
                        active
                          ? 'bg-bg border border-border'
                          : 'border border-transparent hover:bg-bg/60'
                      }`}
                    >
                      {/* Mini palette preview */}
                      <span
                        className="shrink-0 grid grid-cols-[3fr_2fr] w-12 h-8 rounded-[2px] overflow-hidden border border-border"
                        style={{ backgroundColor: t.colors[0] }}
                      >
                        <span
                          style={{ backgroundColor: t.colors[1] }}
                          className="opacity-70 block"
                        />
                        <span style={{ backgroundColor: t.colors[2] }} className="block" />
                      </span>

                      <span className="flex-1 font-heading text-xs uppercase tracking-wider text-text">
                        {t.label}
                      </span>

                      {active && (
                        <CheckIcon size={16} weight="bold" className="text-accent shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
