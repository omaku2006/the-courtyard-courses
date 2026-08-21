import { motion } from 'motion/react';
import type { ReactNode } from 'react';

const SuggestionCard = ({ children }: { children: ReactNode }) => {
  return (
    <motion.article
      className="bg-surface p-8 rounded-[4px] flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.article>
  );
};

SuggestionCard.Header = ({ tag, title }: { tag: string; title: string }) => {
  return (
    <div className="cardHeader flex flex-col justify-center items-center">
      <motion.span
        className="tag bg-accent px-5 py-2 rounded-[2px] my-4 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {tag}
      </motion.span>
      <h3 className="title mb-4 italic text-center">{title}</h3>
    </div>
  );
};

SuggestionCard.Body = ({ description }: { description: string }) => {
  return (
    <div className="body flex flex-col justify-center items-center my-4">
      <h6 className="text-justify">{description}</h6>
    </div>
  );
};

SuggestionCard.Footer = ({ duration, level }: { duration: string; level: string }) => {
  return (
    <div className="cardFooter flex flex-col justify-center items-baseline my-4">
      <p>Duration : {duration}</p>
      <p>Level : {level}</p>
    </div>
  );
};

export default SuggestionCard;
