import { GoogleLogoIcon } from '@phosphor-icons/react';
import { useAppSelector } from '../../app/hooks';
import LoginForm from '../../components/auth/LoginForm';
import CourtyardBackground from '../../components/ui/CourtyardBackground';
import HrWrapper from '../../components/ui/HrWrapper';
import { useEffect, useRef, useState } from 'react';
import RegistrationForm from '../../components/auth/RegistrationForm';
import { motion } from 'motion/react';

const AuthPage = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [hover, setHover] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(true);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const formContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDoorsOpen(true);
  }, []);

  const animateGate = async (value: boolean) => {
    setDoorsOpen(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLogin(value);
    setDoorsOpen(true);
  };

  return (
    <section>
      <CourtyardBackground className={hover ? 'lampBoost' : ''} />
      <div
        id="loginContainer"
        className={`loginContainer fixed top-1/2 left-1/2 -translate-1/2 z-40 bg-surface w-120 max-[600px]:w-[95vw] p-8 h-[80vh] max-h-[1000px] overflow-y-scroll overflow-x-hidden rounded-[4px] border-3 border-accent-hover`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        ref={formContainer}
      >
        <motion.div
          className={`leftDoor w-1/2 h-full absolute left-0 top-0 bg-surface border-t border-b border-r  border-accent-hover z-50`}
          initial={{ x: 0 }}
          animate={{ x: doorsOpen ? '-120%' : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <motion.div
          className={`rightDoor w-1/2 h-full absolute right-0 top-0 bg-surface border-t border-b border-l  border-accent-hover z-50`}
          initial={{ x: 0 }}
          animate={{ x: doorsOpen ? '120%' : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <div id="lofinTopPart" className="relative flex flex-col justify-center items-center">
          <div className="logoWrapper flex justify-evenly items-center gap-3">
            <img
              src={
                theme === 'dark'
                  ? '/TheCourtyardCourses(Dark).Plain.Stroke.svg'
                  : '/TheCourtyardCourses(Light).Stroke.Plain.svg'
              }
              alt="TheCourtyardCourses"
              width={160}
            />
            <div className="brandName">
              <h4>The Courtyard Courses</h4>
              <HrWrapper name="ESTD. 2026" />
            </div>
          </div>
          <HrWrapper name="⚜" className="border-2" />
        </div>
        <div id="loginMiddlePart" className="relative">
          {login ? (
            <LoginForm setLogin={animateGate} formContainer={formContainer} />
          ) : (
            <RegistrationForm setLogin={animateGate} formContainer={formContainer} />
          )}
        </div>
        <HrWrapper name="OR" className="border-2" />
        <div id="loginBottomPart">
          <button className="btnSecondary continueWithGoogle w-full flex items-center justify-evenly">
            <GoogleLogoIcon size={28} weight="bold" /> Continue With Google
          </button>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
