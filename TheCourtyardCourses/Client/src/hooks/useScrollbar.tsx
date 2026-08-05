import { useEffect } from 'react';

export const useAutoHideScrollbar = () => {
  useEffect(() => {
    // NodeJS.Timeout ni jagya e browser mate ReturnType<typeof setTimeout> lakhvo better che
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      // Scroll thay tyare 'is-scrolling' class muki do
      document.body.classList.add('is-scrolling');

      // Pehla no timeout clear kari do
      window.clearTimeout(timeoutId);

      // 1 second sudhi koi scroll nahi thay to class kadhi nakhjo
      timeoutId = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 1000);
    };

    // Event Listener lagavo
    window.addEventListener('scroll', handleScroll);

    // Component unmount thay etle event listener kadhi nakhvo (Clean up)
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
      document.body.classList.remove('is-scrolling');
    };
  }, []);
};
