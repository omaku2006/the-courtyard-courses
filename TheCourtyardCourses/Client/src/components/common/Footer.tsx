import {
  DiscordLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  TelegramLogoIcon,
  TwitterLogoIcon,
} from '@phosphor-icons/react';
import { useAppSelector } from '../../app/hooks';
import NightPole from '../ui/NightPole';
import DayPole from '../ui/DayPole';
import Fog from '../ui/Fog';

const Footer = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  return (
    <footer className="footer border-3 border-accent-hover rounded-[4px] p-5 overflow-x-hidden relative">
      <div className="footerAbovePart xl:grid xl:grid-cols-[1fr_auto_1fr_auto_1fr] flex flex-col justify-center items-center">
        {theme === 'dark' && <Fog />}
        <section id="footerLogo" className="flex justify-center items-center my-10">
          {theme === 'dark' ? (
            <img
              src="../src/assets/TheCourtyardCourses(Dark).Plain.Stroke.svg"
              alt="The Courtyard Courses"
              className="h-80 m-2"
            />
          ) : (
            <img
              src="../src/assets/TheCourtyardCourses(Light).Stroke.Plain.svg"
              alt="The Courtyard Courses"
              className="h-80 m-2"
            />
          )}
        </section>
        <div className="pole xl:relative absolute lg:left-0 md:-left-10 -left-50">
          {theme === 'dark' ? <NightPole className="lamp-glow" /> : <DayPole />}
        </div>
        <section id="footerLinks" className="flex flex-col items-center justify-center my-10">
          <h5 className="mb-2">Useful Links</h5>
          <div className="h-1 w-full bg-border my-1" />
          <ul className="flex flex-col items-center justify-center gap-6 my-2 relative">
            <li className="group relative w-full flex items-center justify-start px-2">
              <a href="#">Home</a>
              <span className="duration-500 w-0 h-0.5 group-hover:w-full bg-surface absolute left-0 bottom-0" />
            </li>

            <li className="group relative w-full flex items-center justify-start px-2">
              <a href="#">Courses</a>
              <span className="duration-500 w-0 h-0.5 group-hover:w-full bg-surface absolute left-0 bottom-0" />
            </li>
            <li className="group relative w-full flex items-center justify-start px-2">
              <a href="#">Community</a>
              <span className="duration-500 w-0 h-0.5 group-hover:w-full bg-surface absolute left-0 bottom-0" />
            </li>
            <li className="group relative w-full flex items-center justify-start px-2">
              <a href="#">Analysis & Schedule</a>
              <span className="duration-500 w-0 h-0.5 group-hover:w-full bg-surface absolute left-0 bottom-0" />
            </li>
            <li className="group relative w-full flex items-center justify-start px-2">
              <a href="#">About Us</a>
              <span className="duration-500 w-0 h-0.5 group-hover:w-full bg-surface absolute left-0 bottom-0" />
            </li>
          </ul>
        </section>
        <div className="pole xl:relative absolute lg:right-0 md:-right-10 -right-50">
          {theme === 'dark' ? <NightPole className="lamp-glow" /> : <DayPole />}
        </div>
        <section id="footerFollowMe" className="flex flex-col items-center justify-center my-10">
          <h5 className="mb-2">Follow Me</h5>
          <div className="h-1 w-full bg-border my-1" />
          <ul className="flex flex-col items-center justify-center gap-2 my-2 relative">
            <li className="group relative w-full flex items-center justify-start px-2">
              <a
                href="#"
                className="flex items-center justify-center gap-3 hover:bg-surface px-4 py-2 radius-[2px]"
              >
                <InstagramLogoIcon /> Instagram
              </a>
            </li>

            <li className="group relative w-full flex items-center justify-start px-2">
              <a
                href="#"
                className="grid grid-cols-[auto_1fr] items-center justify-center gap-3 hover:bg-surface px-4 py-2 radius-[2px] w-full"
              >
                <TwitterLogoIcon /> Twitter
              </a>
            </li>
            <li className="group relative w-full flex items-center justify-start px-2">
              <a
                href="#"
                className="grid grid-cols-[auto_1fr] items-center justify-center gap-3 hover:bg-surface px-4 py-2 radius-[2px] w-full"
              >
                <GithubLogoIcon /> Github
              </a>
            </li>
            <li className="group relative w-full flex items-center justify-start px-2">
              <a
                href="#"
                className="grid grid-cols-[auto_1fr] items-center justify-center gap-3 hover:bg-surface px-4 py-2 radius-[2px] w-full"
              >
                <TelegramLogoIcon /> Telegram
              </a>
            </li>
            <li className="group relative w-full flex items-center justify-start px-2">
              <a
                href="#"
                className="grid grid-cols-[auto_1fr] items-center justify-center gap-3 hover:bg-surface px-4 py-2 radius-[2px] w-full"
              >
                <DiscordLogoIcon /> Discord
              </a>
            </li>
          </ul>
        </section>
      </div>
      <div className="footerBelowPart p-3 flex items-center justify-center bg-surface ">
        <span>The Courtyard Courses &copy; 2026</span>
      </div>
    </footer>
  );
};

export default Footer;
