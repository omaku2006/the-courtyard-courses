import { motion } from 'motion/react';

const EthosBar = () => {
  return (
    <>
      <motion.h2
        className="underline mb-6 text-center"
        initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        -:Ethos Bar:-
      </motion.h2>

      <section className="grid grid-cols-1 md:grid-cols-[auto_auto_auto_auto] gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-8 m-6 max-w-5xl mx-auto text-center md:text-left justify-items-center md:justify-items-start">
        {ethosItems.map((item, i) => (
          <motion.div
            key={i}
            className="contents"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <span className="text-primary text-xl self-center">⚜</span>
            <span className="font-heading text-sm font-bold self-center whitespace-nowrap">
              {item.title}
            </span>
            <span className="opacity-50 hidden md:inline self-center">—</span>
            <span className="italic text-text opacity-80 self-center text-sm md:text-base">
              "{item.description}"
            </span>
          </motion.div>
        ))}
      </section>
    </>
  );
};

const ethosItems = [
  { title: 'Rigorous Scholarship', description: 'Mastery through classical foundations.' },
  { title: 'Timeless Curriculum', description: 'Where history meets modern pedagogy.' },
  { title: 'Expert Mentorship', description: 'Guidance from dedicated masters of the craft.' },
  { title: 'Global Courtyard', description: 'A sanctuary for scholars, anywhere.' },
];

export default EthosBar;
