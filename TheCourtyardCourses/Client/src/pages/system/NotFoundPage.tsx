import { Link } from 'react-router-dom';
import SystemBase from './SystemBase';
import FuzzyText from '../../../components/FuzzyText';
import { useAppSelector } from '../../app/hooks';

const NotFoundPage = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const fuzzColor = theme === 'dark' ? '#f7f3ea' : '#3a2b1e';

  return (
    <SystemBase>
      <div className="flex flex-col items-center text-center gap-3">
        <FuzzyText color={fuzzColor} fontWeight={900} fontSize="clamp(3rem, 12vw, 8rem)">
          404
        </FuzzyText>

        <h3>The Gate You Seek Cannot Be Found</h3>

        <p>You appear to have wandered beyond the known halls of the Courtyard.</p>

        <button className="btnThird mt-4">
          <Link to={'/dashboard'}> Return to the Courtyard</Link>
        </button>
      </div>
    </SystemBase>
  );
};

export default NotFoundPage;
