import type { ReactNode } from 'react';
import { useAppSelector } from '../../app/hooks';
import CourtyardBackground from '../../components/ui/CourtyardBackground';
import HrWrapper from '../../components/ui/HrWrapper';

const SystemBase = ({ children }: { children: ReactNode }) => {
  const theme = useAppSelector((state) => state.theme.mode);
  return (
    <div className="">
      <CourtyardBackground />
      <section className="wrapper fixed z-30 bg-bg top-1/2 left-1/2 -translate-1/2 p-5 flex justify-center items-center border-3 border-accent-hover max-[1400px]:flex-col ">
        <div className="leftPart flex justify-center items-center min-[1400px]:pr-5 max-[1400px]:pb-5 min-[1400px]:border-r-3 min-[1400px]:border-r-accent-hover max-[1400px]:border-b-3 max-[1400px]:border-b-accent-hover shrink-0">
          <img
            src={
              theme.startsWith('dark')
                ? '/TheCourtyardCourses(Dark).Plain.Stroke.svg'
                : '/TheCourtyardCourses(Light).Stroke.Plain.svg'
            }
            alt="TheCourtyardCourses"
            className="h-40 max-[700px]:h-20"
          />
          <h4>
            The
            <br />
            Courtyard
            <br />
            Courses
            <HrWrapper name="ESTD. 2026" />
          </h4>
        </div>
        <div className="rightPart px-4">
          <h4>{children}</h4>
        </div>
      </section>
    </div>
  );
};

export default SystemBase;
