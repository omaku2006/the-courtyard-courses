import { useAppSelector } from '../../../app/hooks';
import DayPole from '../../ui/DayPole';
import Fog from '../../ui/Fog';
import NightPole from '../../ui/NightPole';

const Hero = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  return (
    <section className="w-full flex items-center justify-center relative">
      <div className="flex min-[1360px]:justify-between min-[960px]:justify-center max-[960px]:ml-auto max-[960px]:p-6 max-[500px]:p-3 items-center h-[100vh] min-[1360px]:w-full w-[80%] max-[530px]:w-full max-[530px]:ml-0">
        {theme === 'dark' && <Fog />}
        <div className="pole min-[1360px]:relative min-[1360px]:left-0 absolute -left-50 max-[530px]:hidden visible">
          {theme === 'dark' ? (
            <NightPole className="lamp-glow-intense" height={800} />
          ) : (
            <DayPole height={800} />
          )}
        </div>
        <div className="ctaSection py-12 flex flex-col items-center  relative">
          <p className="py-2 px-4 bg-surface rounded-[2px] my-1.5 ">
            EST. 2026 — A Modern Institution of Classical Learning
          </p>
          <h1 className="my-8 text-center max-[960px]:text-right max-[870px]:text-center">
            The Courtyard Courses
          </h1>
          <h4 className="my-5 text-justify">
            "Forge your intellect within the hallowed halls of tradition. We marry the rigorous
            scholarship of the Victorian era with the precision of modern pedagogy. Your pursuit of
            mastery begins at the gilded gates."
          </h4>
          <div className="CTAGroup flex justify-evenly items-center w-full my-8 max-[770px]:flex-col max-[770px]:gap-4">
            <button className="btnPrimary">View the Prospectus</button>
            <button className="btnSecondary">Scholars' Portal</button>
          </div>
        </div>
        <div className="pole min-[1360px]:relative min-[1360px]:right-0 min-[960px]:absolute min-[960px]:-right-50 max-[960px]:hidden">
          {theme === 'dark' ? (
            <NightPole className="lamp-glow-intense" height={800} />
          ) : (
            <DayPole height={800} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
