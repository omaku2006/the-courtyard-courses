import Pole from './Pole';

const DayPole = ({ height = 600, fill = '#3a2b1e' }: { height?: number; fill?: string }) => {
  return <Pole fill={fill} height={height} />;
};

export default DayPole;
