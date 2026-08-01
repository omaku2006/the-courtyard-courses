import type React from 'react';

const SingleColumnLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="pageContent relative">{children}</div>
    </>
  );
};

export default SingleColumnLayout;
