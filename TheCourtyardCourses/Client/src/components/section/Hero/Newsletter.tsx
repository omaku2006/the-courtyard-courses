import { motion } from 'motion/react';

const Newsletter = () => {
  return (
    <motion.section
      className="w-full max-w-5xl mx-auto py-24 px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="relative bg-card border-2 border-border p-12 md:p-16 text-center shadow-[6px_6px_0px_var(--color-border)]">
        {/* Victorian Inner Frame */}
        <motion.div
          className="absolute inset-3 border border-border opacity-20 pointer-events-none"
          initial={{ opacity: 0, scale: 1.02 }}
          whileInView={{ opacity: 0.2, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <motion.span
            className="font-heading text-xs uppercase tracking-widest text-primary block mb-3"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            The Courtyard Gazette
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-heading text-text mb-4"
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Subscribe to the Gazette
          </motion.h2>
          <motion.p
            className="italic text-text opacity-80 max-w-xl mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            "Receive scholarly articles, course announcements, and invitations to exclusive lectures
            directly to your inbox. Join our learned community today."
          </motion.p>

          {/* Form */}
          <motion.form
            className="flex flex-col md:flex-row gap-4 w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onSubmit={(e) => {
              e.preventDefault();
              alert('Welcome to the Courtyard!');
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your scholarly email..."
              className="flex-grow bg-background border-2 border-border text-text px-4 py-3 font-body focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="bg-cta text-background font-heading uppercase tracking-wider px-8 py-3 border-2 border-border hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Request Entry
            </button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export default Newsletter;
