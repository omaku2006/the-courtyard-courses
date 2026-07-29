import type React from 'react';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';

const SingleColumnLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="pageContent relative">{children}</div>
      <Footer />
    </>
  );
};

export default SingleColumnLayout;
