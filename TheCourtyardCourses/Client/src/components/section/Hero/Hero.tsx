import { motion } from 'motion/react';
import { useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import DayPole from '../../ui/DayPole';
import NightPole from '../../ui/NightPole';
import Fog from '../../ui/Fog';

const Hero = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme.startsWith('dark');
  const navigate = useNavigate();
  return (
    <section className="w-full flex items-center justify-center relative">
      <div className="flex min-[1360px]:justify-between min-[960px]:justify-center max-[960px]:ml-auto max-[960px]:p-6 max-[500px]:p-3 items-center h-[100vh] min-[1360px]:w-full w-[80%] max-[530px]:w-full max-[530px]:ml-0">
        {isDark && <Fog />}
        <motion.div
          className="pole min-[1360px]:relative min-[1360px]:left-0 absolute -left-50 max-[530px]:hidden visible"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {isDark ? (
            <NightPole className="lamp-glow-intense" height={800} />
          ) : (
            <DayPole height={800} />
          )}
        </motion.div>
        <div className="ctaSection py-12 flex flex-col items-center relative">
          <motion.p
            className="py-2 px-4 bg-surface rounded-[2px] my-1.5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            EST. 2026 — A Modern Institution of Classical Learning
          </motion.p>
          <motion.h1
            className="my-8 text-center max-[960px]:text-right max-[870px]:text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            The Courtyard Courses
          </motion.h1>
          <motion.h4
            className="my-5 text-justify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            "Forge your intellect within the hallowed halls of tradition. We marry the rigorous
            scholarship of the Victorian era with the precision of modern pedagogy. Your pursuit of
            mastery begins at the gilded gates."
          </motion.h4>
          <motion.div
            className="CTAGroup flex justify-evenly items-center w-full my-8 max-[770px]:flex-col max-[770px]:gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <button className="btnPrimary" onClick={() => navigate('/courses')}>View the Prospectus</button>
            <button className="btnSecondary" onClick={() => navigate('/login')}>Scholars' Portal</button>
          </motion.div>
        </div>
        <motion.div
          className="pole min-[1360px]:relative min-[1360px]:right-0 min-[960px]:absolute min-[960px]:-right-50 max-[960px]:hidden"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {isDark ? (
            <NightPole className="lamp-glow-intense" height={800} />
          ) : (
            <DayPole height={800} />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
