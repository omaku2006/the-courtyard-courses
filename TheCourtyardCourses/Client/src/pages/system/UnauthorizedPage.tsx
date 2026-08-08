import SystemBase from './SystemBase';

const UnauthorizedPage = () => {
  return (
    <SystemBase>
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-6xl font-serif">403</h1>

        <h2 className="text-3xl font-serif tracking-widest">THE GATES ARE CLOSED TO YOU</h2>

        <p className="max-w-xl text-lg">
          You do not have the required permission to enter these halls. Please sign in with an
          authorised account to continue.
        </p>

        <button className="btnThird mt-4">RETURN TO THE COURTYARD</button>
      </div>
    </SystemBase>
  );
};

export default UnauthorizedPage;
