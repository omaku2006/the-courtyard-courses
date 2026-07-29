import type { ReactNode } from 'react';

const Testimonials = ({ children }: { children: ReactNode }) => {
  return (
    <section className="bg-surface p-8 flex flex-col justify-center items-center">
      {children}
    </section>
  );
};

Testimonials.Quote = ({ children }: { children: ReactNode }) => {
  return <div className="quote">{children}</div>;
};

Testimonials.Name = ({ name }: { name: string }) => {
  return <p className="text-right mx-6">~{name}</p>;
};

Testimonials.Designation = ({ designation }: { designation: string }) => {
  return <span className="italic bg-accent px-4 py-2">{designation}</span>;
};

export default Testimonials;
