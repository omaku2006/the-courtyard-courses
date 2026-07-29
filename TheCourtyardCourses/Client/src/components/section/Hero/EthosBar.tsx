const EthosBar = () => {
  return (
    <>
      <h2 className="underline mb-6 text-center">-:Ethos Bar:-</h2>

      <section className="grid grid-cols-1 md:grid-cols-[auto_auto_auto_auto] gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-8 m-6 max-w-5xl mx-auto text-center md:text-left justify-items-center md:justify-items-start">
        <span className="text-primary text-xl self-center">⚜</span>
        <span className="font-heading text-sm font-bold self-center whitespace-nowrap">
          Rigorous Scholarship
        </span>
        <span className="opacity-50 hidden md:inline self-center">—</span>
        <span className="italic text-text opacity-80 self-center text-sm md:text-base">
          "Mastery through classical foundations."
        </span>

        <span className="text-primary text-xl self-center">⚜</span>
        <span className="font-heading text-sm font-bold self-center whitespace-nowrap">
          Timeless Curriculum
        </span>
        <span className="opacity-50 hidden md:inline self-center">—</span>
        <span className="italic text-text opacity-80 self-center text-sm md:text-base">
          "Where history meets modern pedagogy."
        </span>

        <span className="text-primary text-xl self-center">⚜</span>
        <span className="font-heading text-sm font-bold self-center whitespace-nowrap">
          Expert Mentorship
        </span>
        <span className="opacity-50 hidden md:inline self-center">—</span>
        <span className="italic text-text opacity-80 self-center text-sm md:text-base">
          "Guidance from dedicated masters of the craft."
        </span>

        <span className="text-primary text-xl self-center">⚜</span>
        <span className="font-heading text-sm font-bold self-center whitespace-nowrap">
          Global Courtyard
        </span>
        <span className="opacity-50 hidden md:inline self-center">—</span>
        <span className="italic text-text opacity-80 self-center text-sm md:text-base">
          "A sanctuary for scholars, anywhere."
        </span>
      </section>
    </>
  );
};

export default EthosBar;
