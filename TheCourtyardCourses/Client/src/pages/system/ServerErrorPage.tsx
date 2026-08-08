import SystemBase from './SystemBase';

const ServerErrorPage = ({ error = 500 }: { error?: number }) => {
  return (
    <SystemBase>
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-6xl font-serif">{error}</h1>

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
