import type { ReactNode } from 'react';

const SuggestionCard = ({ children }: { children: ReactNode }) => {
  return (
    <article className="bg-surface p-8 rounded-[4px] flex flex-col justify-center items-center hover:-translate-y-2.5 duration-300">
      {children}
    </article>
  );
};

SuggestionCard.Header = ({ tag, title }: { tag: string; title: string }) => {
  return (
    <div className="cardHeader flex flex-col justify-center items-center">
      <span className="tag bg-accent px-5 py-2 rounded-[2px] my-4 text-center">{tag}</span>
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
