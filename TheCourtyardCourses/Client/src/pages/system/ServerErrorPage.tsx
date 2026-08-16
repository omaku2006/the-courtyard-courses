import FuzzyText from '../../../components/FuzzyText';
import { useAppSelector } from '../../app/hooks';
import SystemBase from './SystemBase';

const ServerErrorPage = ({ error = 500 }: { error?: number }) => {
  const theme = useAppSelector((state) => state.theme.mode);
  const fuzzColor = theme === 'dark' ? '#f7f3ea' : '#3a2b1e';
  return (
    <SystemBase>
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <FuzzyText color={fuzzColor} fontWeight={900} fontSize="clamp(3rem, 12vw, 8rem)">
          {error}
        </FuzzyText>
        <h2 className="text-3xl font-serif tracking-widest">
          THE COURTYARD HAS ENCOUNTERED AN ERROR
        </h2>

        <p className="max-w-xl text-lg">
          Something has gone amiss within the halls. Our systems are unable to fulfil your request
          at this time.
        </p>

        <p className="italic">Please return to the Courtyard and try again shortly.</p>
      </div>
    </SystemBase>
  );
};

export default ServerErrorPage;
