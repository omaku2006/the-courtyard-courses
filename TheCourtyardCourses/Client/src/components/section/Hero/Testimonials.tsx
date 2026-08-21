import { motion } from 'motion/react';
import type { ReactNode } from 'react';

const Testimonials = ({ children }: { children: ReactNode }) => {
  return (
    <motion.section
      className="bg-surface p-8 flex flex-col justify-center items-center relative"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="absolute -top-4 left-10 text-8xl"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 0.3, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        "
      </motion.div>
      {children}
      <motion.div
        className="absolute -top-4 right-10 text-8xl"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 0.3, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        "
      </motion.div>
    </motion.section>
  );
};

Testimonials.Quote = ({ children }: { children: ReactNode }) => {
  return <div className="quote">{children}</div>;
};

Testimonials.Name = ({ name, designation }: { name: string; designation: string }) => {
  return (
    <motion.p
      className="text-right mx-6 italic"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      ~{name}
      <br /> ({designation})
    </motion.p>
  );
};

export default Testimonials;
