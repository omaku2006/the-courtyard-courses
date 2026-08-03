import { ArrowLineRightIcon, ArrowRightIcon, GoogleLogoIcon } from '@phosphor-icons/react';
import { useAppSelector } from '../app/hooks';
import LoginForm from '../components/auth/LoginForm';
import CourtyardBackground from '../components/ui/CourtyardBackground';
import HrWrapper from '../components/ui/HrWrapper';
import { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [hover, setHover] = useState<boolean>(false);

  return (
    <section>
      <CourtyardBackground className={hover ? 'lampBoost' : ''} />
      <div
        id="loginContainer"
        className="loginContainer fixed top-1/2 left-1/2 -translate-1/2 z-40 bg-surface w-120 p-8 rounded-[4px] border-3 border-accent-hover"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
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
        <div id="loginMiddlePart">
          <LoginForm />
          <div className="switcherContainer my-3 flex flex-col items-center justify-center gap-1">
            <span className="italic text-text-secondary">New to the Courtyard?</span>
            <span className="relative inline-flex items-center gap-2 italic group cursor-pointer">
              Join the Courtyard
              <ArrowRightIcon
                className="group-hover:translate-x-1.5 duration-300"
                weight="bold"
                size={16}
              />
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-text-primary transition-all duration-300 group-hover:w-full"></span>
            </span>
          </div>
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

export default LoginPage;
