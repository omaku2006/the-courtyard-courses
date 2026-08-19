import { useState, useMemo } from 'react';
import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import { useFetchDailyActivity } from '../../features/schedule/useSchedule';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface Schedule {
  _id: string;
  course: any;
  days: number[];
  targetChaptersPerDay: number;
}

interface ScheduleCalendarProps {
  schedules: Schedule[];
}

const ScheduleCalendar = ({ schedules }: ScheduleCalendarProps) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const { data } = useFetchDailyActivity(month, year);
  const activities = data?.activities || [];

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const activityMap = useMemo(() => {
    const map: Record<string, any> = {};
    activities.forEach((a: any) => { map[a.date] = a; });
    return map;
  }, [activities]);

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const activity = activityMap[dateStr];
    const entries = activity?.entries || [];

    const scheduledToday = schedules.filter((s) => s.days.includes(dayOfWeek));

    const completedByCourse: Record<string, number> = {};
    entries.forEach((e: any) => {
      const cid = e.course?._id?.toString() || e.course?.toString();
      if (cid) completedByCourse[cid] = (completedByCourse[cid] || 0) + 1;
    });

    let allMet = scheduledToday.length > 0;
    let anyDone = false;
    scheduledToday.forEach((s) => {
      const cid = s.course?._id?.toString();
      const done = completedByCourse[cid] || 0;
      if (done >= (s.targetChaptersPerDay || 1)) {
        anyDone = true;
      } else {
        allMet = false;
      }
    });

    const isToday = dateStr === today.toISOString().split('T')[0];

    let statusBg = '';
    let statusContent: React.ReactNode = null;

    if (scheduledToday.length > 0 && allMet) {
      statusBg = 'bg-success/20 border-success';
      statusContent = <CheckIcon size={10} weight="bold" className="text-success" />;
    } else if (anyDone) {
      statusBg = 'bg-accent/20 border-accent';
      const totalDone = Object.values(completedByCourse).reduce((a, b) => a + b, 0);
      statusContent = (
        <span className="no-margin font-heading font-bold text-accent" style={{ fontSize: '0.5rem' }}>{totalDone}</span>
      );
    } else if (scheduledToday.length > 0) {
      statusBg = 'bg-highlight/10 border-border';
      statusContent = (
        <div className="w-1.5 h-1.5 rounded-full bg-highlight/40" />
      );
    }

    cells.push(
      <div
        key={day}
        className={`aspect-square flex flex-col items-center justify-center rounded-sm border text-center transition-colors relative ${statusBg || 'border-transparent'} ${isToday ? 'ring-2 ring-accent' : ''}`}
      >
        <span className={`no-margin font-heading ${isToday ? 'font-bold text-accent' : 'text-text'}`} style={{ fontSize: '0.75rem' }}>
          {day}
        </span>
        {statusContent && <div className="mt-0.5">{statusContent}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 rounded-sm border-2 border-border bg-surface">
      {/* Month Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-sm border-2 border-border text-text-muted hover:border-accent-hover hover:text-accent-hover transition-colors"
        >
          <CaretLeftIcon size={14} weight="bold" />
        </button>
        <h3 className="no-margin font-heading font-bold text-text uppercase tracking-wider" style={{ fontSize: '0.875rem' }}>
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-sm border-2 border-border text-text-muted hover:border-accent-hover hover:text-accent-hover transition-colors"
        >
          <CaretRightIcon size={14} weight="bold" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[9px] font-heading uppercase tracking-wider text-text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 font-heading text-text-muted" style={{ fontSize: '0.5625rem' }}>
        <span className="no-margin flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-success/20 border border-success" /> Target met
        </span>
        <span className="no-margin flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-accent/20 border border-accent" /> Partial
        </span>
        <span className="no-margin flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-highlight/10 border border-border" /> Scheduled
        </span>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
