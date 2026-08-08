import { Link } from 'react-router-dom';
import SystemBase from './SystemBase';

const NotFoundPage = () => {
  return (
    <SystemBase>
      <div className="flex flex-col items-center text-center gap-3">
        <h1>404</h1>

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
