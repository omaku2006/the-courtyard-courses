import { useState } from 'react';
import { XIcon, CheckIcon, SpinnerGapIcon } from '@phosphor-icons/react';
import { useCreateSchedule } from '../../features/schedule/useSchedule';
import type { Course } from '../../types/FetchDataTypes';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Schedule {
  _id: string;
  course: any;
  days: number[];
  targetChaptersPerDay: number;
}

interface ScheduleCreatorProps {
  enrolledCourses: any[];
  schedules: Schedule[];
  onClose: () => void;
}

const ScheduleCreator = ({ enrolledCourses, schedules, onClose }: ScheduleCreatorProps) => {
  const createSchedule = useCreateSchedule();

  const scheduledCourseIds = new Set(schedules.map((s) => s.course?._id));
  const availableCourses = enrolledCourses.filter(
    (c: any) => !scheduledCourseIds.has(c._id)
  );

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [target, setTarget] = useState(1);

  const toggleDay = (d: number) => {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleSubmit = () => {
    if (!selectedCourse || selectedDays.length === 0) return;
    createSchedule.mutate(
      { courseId: selectedCourse, days: selectedDays, targetChaptersPerDay: target },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md flex flex-col gap-4 p-5 rounded-sm border-2 border-border bg-surface">
        <div className="flex items-center justify-between">
          <h3 className="no-margin font-heading font-bold text-text" style={{ fontSize: '1rem' }}>Set Schedule</h3>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-text transition-colors">
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        {/* Course Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-heading uppercase tracking-wider text-text-muted">
            Course
          </label>
          {availableCourses.length === 0 ? (
            <p className="no-margin py-4 text-center text-text-muted" style={{ fontSize: '0.75rem' }}>
              All enrolled courses are already scheduled.
            </p>
          ) : (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-sm border-2 border-border bg-bg text-text text-sm font-body focus:outline-none focus:border-accent-hover transition-colors"
            >
              <option value="">Select a course...</option>
              {availableCourses.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Days */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-heading uppercase tracking-wider text-text-muted">
            Days
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {DAY_NAMES.map((d, i) => (
              <button
                key={d}
                onClick={() => toggleDay(i)}
                className={`px-2.5 py-1 rounded-sm text-[10px] font-heading uppercase tracking-wider border-2 transition-colors ${
                  selectedDays.includes(i)
                    ? 'bg-accent text-light border-accent'
                    : 'bg-transparent text-text-muted border-border hover:border-accent-hover'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Target */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-heading uppercase tracking-wider text-text-muted">
            Chapters per day
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={target}
            onChange={(e) => setTarget(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-20 px-3 py-2 rounded-sm border-2 border-border bg-bg text-text text-sm font-body focus:outline-none focus:border-accent-hover transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCourse || selectedDays.length === 0 || createSchedule.isPending}
          className="btnPrimary w-full flex items-center justify-center gap-2 py-2!"
        >
          {createSchedule.isPending ? (
            <SpinnerGapIcon size={16} weight="bold" className="animate-spin" />
          ) : (
            <CheckIcon size={16} weight="bold" />
          )}
          {createSchedule.isPending ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleCreator;
