import Pole from './Pole';

const DayPole = ({
  height = 600,
  width,
  fill = '#3a2b1e',
  className,
}: {
  height?: number | string;
  width?: number | string;
  fill?: string;
  className?: string;
}) => {
  return <Pole fill={fill} height={height} width={width} className={className} />;
};

export default DayPole;
