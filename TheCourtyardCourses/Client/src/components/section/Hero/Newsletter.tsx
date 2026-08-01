const Newsletter = () => {
  return (
    <section className="w-full max-w-5xl mx-auto py-24 px-4">
      <div className="relative bg-card border-2 border-border p-12 md:p-16 text-center shadow-[6px_6px_0px_var(--color-border)]">
        {/* Victorian Inner Frame */}
        <div className="absolute inset-3 border border-border opacity-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-3">
            The Courtyard Gazette
          </span>
          <h2 className="text-3xl md:text-4xl font-heading text-text mb-4">
            Subscribe to the Gazette
          </h2>
          <p className="italic text-text opacity-80 max-w-xl mb-8">
            "Receive scholarly articles, course announcements, and invitations to exclusive lectures
            directly to your inbox. Join our learned community today."
          </p>

          {/* Form */}
          <form
            className="flex flex-col md:flex-row gap-4 w-full max-w-lg"
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
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
