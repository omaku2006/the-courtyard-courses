import SystemBase from './SystemBase';

const MaintenancePage = () => {
  return (
    <SystemBase>
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-6xl font-serif">503</h1>

        <h2 className="text-3xl font-serif tracking-widest">THE COURTYARD IS UNDER MAINTENANCE</h2>

        <p className="max-w-xl text-lg">
          The gates are temporarily closed while we tend to the halls, polish the lamps, and prepare
          the Courtyard for your return.
        </p>

        <p className="italic">Please return shortly.</p>
      </div>
    </SystemBase>
  );
};

export default MaintenancePage;
