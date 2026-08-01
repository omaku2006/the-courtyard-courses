import type { ReactNode } from 'react';

const Testimonials = ({ children }: { children: ReactNode }) => {
  return (
    <section className="bg-surface p-8 flex flex-col justify-center items-center relative">
      <div className="absolute -top-4 left-10 text-8xl">“</div>
      {children}
      <div className="absolute -top-4 right-10 text-8xl">”</div>
    </section>
  );
};

Testimonials.Quote = ({ children }: { children: ReactNode }) => {
  return <div className="quote">{children}</div>;
};

Testimonials.Name = ({ name, designation }: { name: string; designation: string }) => {
  return (
    <p className="text-right mx-6 italic">
      ~{name}
      <br /> ({designation})
    </p>
  );
};

// Testimonials.Designation = ({ designation }: { designation: string }) => {
//   return <span className="italic bg-accent px-4 py-2">{designation}</span>;
// };

export default Testimonials;
