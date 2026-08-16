import { useNavigate } from 'react-router-dom';
import FuzzyText from '../../../components/FuzzyText';
import { useAppSelector } from '../../app/hooks';
import SystemBase from './SystemBase';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.mode);
  const fuzzColor = theme === 'dark' ? '#f7f3ea' : '#3a2b1e';
  return (
    <SystemBase>
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <FuzzyText color={fuzzColor} fontWeight={900} fontSize="clamp(3rem, 12vw, 8rem)">
          403
        </FuzzyText>

        <h2 className="text-3xl font-serif tracking-widest">THE GATES ARE CLOSED TO YOU</h2>

        <p className="max-w-xl text-lg">
          You do not have the required permission to enter these halls. Please sign in with an
          authorised account to continue.
        </p>

        <button className="btnThird mt-4" onClick={() => navigate('/')}>
          RETURN TO THE COURTYARD
        </button>
      </div>
    </SystemBase>
  );
};

export default UnauthorizedPage;
