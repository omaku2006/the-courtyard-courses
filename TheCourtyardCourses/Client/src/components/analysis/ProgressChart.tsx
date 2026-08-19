interface DayData {
  date: string;
  day: string;
  chaptersCompleted: number;
}

interface ProgressChartProps {
  data: DayData[];
}

const ProgressChart = ({ data }: ProgressChartProps) => {
  const max = Math.max(...data.map((d) => d.chaptersCompleted), 1);

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => {
        const height = (d.chaptersCompleted / max) * 100;
        return (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
            <span className="no-margin font-heading text-text-muted" style={{ fontSize: '0.5625rem' }}>
              {d.chaptersCompleted}
            </span>
            <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
              <div
                className={`w-full max-w-[32px] rounded-t-sm transition-all ${
                  d.chaptersCompleted > 0 ? 'bg-accent' : 'bg-border'
                }`}
                style={{ height: `${Math.max(height, 4)}%` }}
              />
            </div>
            <span className="no-margin font-heading text-text-muted" style={{ fontSize: '0.5625rem' }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressChart;
