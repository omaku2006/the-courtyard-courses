import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import SingleColumnLayout from '../components/layout/SingleColumnLayout';
import DayPole from '../components/ui/DayPole';
import NightPole from '../components/ui/NightPole';
import Fog from '../components/ui/Fog';
import EthosBar from '../components/section/Hero/EthosBar';
import HrWrapper from '../components/ui/HrWrapper';
import FadeInView from '../components/ui/Animate';

const AboutPage = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme.startsWith('dark');
  const navigate = useNavigate();

  return (
    <SingleColumnLayout>
      {/* ── Hero ─────────────────────────────────────────────── */}
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
              About The Courtyard
            </motion.h1>
            <motion.h4
              className="my-5 text-justify max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              "Within these gilded walls, we have forged a sanctuary where the rigour of Victorian
              scholarship meets the boundless potential of modern technology. Here, every scholar
              finds their path, and every master shapes the future."
            </motion.h4>
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

      {/* ── Origin Story ─────────────────────────────────────── */}
      <FadeInView>
        <section className="w-full max-w-5xl mx-auto py-24 px-4">
          <div className="relative bg-card border-2 border-border p-12 md:p-16 text-center shadow-[6px_6px_0px_var(--color-border)]">
            <div className="absolute inset-3 border border-border opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-3">
                ⚜ Our Story ⚜
              </span>
              <h2 className="underline mb-6">-:The Genesis of the Courtyard:-</h2>

              <p className="italic text-text opacity-80 max-w-2xl mb-6 text-justify">
                The Courtyard Courses was born from a singular vision — to craft an online learning
                platform that is as memorable as it is functional. The founder, Om Upadhyay,
                envisioned a dashboard website where teachers could create courses, share resources,
                and build communities, whilst students could enrol in courses, join public and
                private communities, schedule their studies, and track their own progress through
                comprehensive analytics.
              </p>

              <p className="italic text-text opacity-80 max-w-2xl mb-6 text-justify">
                The inspiration struck from a dashboard interface so distinctive that it lingered in
                the mind long after one had departed. Driven by this vision, the pursuit began — to
                design a user interface so unique and refined that completing a course would feel
                not like a chore, but like a privilege. Every element, from the Victorian aesthetic
                to the heraldic motifs, was crafted to ensure that the learning experience is both
                memorable and delightful.
              </p>

              <p className="italic text-text opacity-80 max-w-2xl text-justify">
                Security was never an afterthought. Permission-based communities, authorised access
                controls, and role-based privileges ensure that only those with rightful standing
                may view, edit, or manage content. The Courtyard stands as a testament to the belief
                that beauty and security need not be at odds.
              </p>
            </div>
          </div>
        </section>
      </FadeInView>

      {/* ── Mission & Vision ─────────────────────────────────── */}
      <section className="flex flex-col items-center p-6 w-full my-10">
        <FadeInView>
          <span className="px-4 py-2 bg-surface mb-6 italic">Purpose & Aspiration</span>
        </FadeInView>
        <FadeInView delay={0.1}>
          <h2 className="underline mb-10">-:Our Mission & Vision:-</h2>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <FadeInView x={-30}>
            <div className="relative bg-card border-2 border-border p-8 shadow-[4px_4px_0px_var(--color-border)]">
              <div className="absolute inset-2 border border-border opacity-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <span className="text-accent text-3xl">⚜</span>
                <h3 className="underline">Our Mission</h3>
                <p className="italic text-text opacity-80 text-justify">
                  To provide a learning platform of unparalleled beauty and utility — one where
                  teachers may create, manage, and share their knowledge with ease, and students may
                  enrol, schedule, track progress, and engage with communities in a secure, elegant
                  environment. We strive to ensure that every interaction within The Courtyard is
                  intuitive, memorable, and free from the mundane.
                </p>
              </div>
            </div>
          </FadeInView>

          <FadeInView x={30}>
            <div className="relative bg-card border-2 border-border p-8 shadow-[4px_4px_0px_var(--color-border)]">
              <div className="absolute inset-2 border border-border opacity-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <span className="text-accent text-3xl">⚜</span>
                <h3 className="underline">Our Vision</h3>
                <p className="italic text-text opacity-80 text-justify">
                  To be the foremost destination for scholars and educators who demand both
                  aesthetic excellence and robust functionality. We envision a global courtyard
                  where learning transcends boundaries — where a student in any corner of the world
                  may access the finest curriculum, guided by dedicated masters, within an interface
                  so distinguished that it becomes an integral part of the learning journey itself.
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="flex flex-col items-center p-6 w-full my-10 min-h-[600px]">
        <FadeInView>
          <span className="px-4 py-2 bg-surface mb-6 italic">What We Offer</span>
        </FadeInView>
        <FadeInView delay={0.1}>
          <h2 className="underline mb-10">-:The Pillars of the Courtyard:-</h2>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="w-[80%] max-[600px]:w-full text-center mb-10 mx-auto">
            Every feature has been meticulously designed to serve a purpose — from the teacher's
            need for seamless course management to the student's pursuit of structured, engaging
            learning.
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {features.map((f, i) => (
            <FadeInView key={f.title} delay={i * 0.08} y={25}>
              <motion.div
                className="flex flex-col items-center text-center p-6 bg-surface border-2 border-border rounded-[4px] gap-3"
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <span className="text-accent text-2xl">⚜</span>
                <h4 className="underline">{f.title}</h4>
                <p className="italic text-text opacity-80 text-sm">{f.description}</p>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </section>

      {/* ── Founder ──────────────────────────────────────────── */}
      <section className="flex flex-col items-center p-6 w-full my-10">
        <FadeInView>
          <span className="px-4 py-2 bg-surface mb-6 italic">The Architect</span>
        </FadeInView>
        <FadeInView delay={0.1}>
          <h2 className="underline mb-10">-:The Founder:-</h2>
        </FadeInView>

        <FadeInView scale={0.95}>
          <div className="flex flex-col items-center bg-surface px-8 pb-8 border-2 border-border rounded-[4px] max-w-md w-full">
            <motion.div
              className="w-40 h-44 rounded-b-full overflow-hidden bg-accent border-2 border-border border-t-0 mx-auto -mt-px"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src="/UpadhyayOm.jpg" alt="Om Upadhyay" className="w-full h-full object-cover" />
            </motion.div>
            <h3
              className="no-margin text-center font-heading font-bold uppercase tracking-wider mt-5"
              style={{ fontSize: '1.125rem' }}
            >
              Om Upadhyay
            </h3>
            <h6
              className="no-margin text-center font-heading font-semibold uppercase tracking-widest mt-2"
              style={{ fontSize: '0.6875rem' }}
            >
              Founder & Sole Developer
            </h6>
            <hr className="w-full h-1 rounded-[2px] border-accent my-6" />
            <p
              className="no-margin font-body italic text-justify leading-relaxed"
              style={{ fontSize: '0.75rem' }}
            >
              A solitary architect who designed and built both the backend and frontend of The
              Courtyard Courses from the ground up. With a passion for Victorian aesthetics and
              modern web technologies — React, TypeScript, Redux Toolkit, TanStack Query, and
              MongoDB — Om crafted every pixel and every endpoint to deliver an experience that is
              both beautiful and secure. The Courtyard stands as a personal milestone: a testament
              to what one determined mind can achieve when vision meets execution.
            </p>
            <div className="flex flex-wrap gap-2 mt-5 justify-center">
              {['React', 'TypeScript', 'Redux Toolkit', 'TanStack Query', 'MongoDB', 'Express'].map(
                (t) => (
                  <span
                    key={t}
                    className="no-margin inline-flex items-center font-heading uppercase tracking-wider px-3 py-1 rounded-sm border border-border bg-bg text-text-muted"
                    style={{ fontSize: '0.625rem' }}
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </FadeInView>
      </section>

      {/* ── Ethos ─────────────────────────────────────────────── */}
      <section className="flex flex-col items-center p-6 w-full my-10">
        <FadeInView>
          <HrWrapper name="Our Guiding Principles" />
        </FadeInView>
        <EthosBar />
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <FadeInView>
        <section className="w-full max-w-5xl mx-auto py-24 px-4">
          <div className="relative bg-card border-2 border-border p-12 md:p-16 text-center shadow-[6px_6px_0px_var(--color-border)]">
            <div className="absolute inset-3 border border-border opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <span className="font-heading text-xs uppercase tracking-widest text-primary block mb-3">
                Your Journey Awaits
              </span>
              <h2 className="text-3xl md:text-4xl font-heading text-text mb-4">
                Begin at the Gilded Gates
              </h2>
              <p className="italic text-text opacity-80 max-w-xl mb-8">
                "Whether you seek to master the ancient arts or forge new paths in modern
                disciplines, The Courtyard welcomes you. Step through the gates and let your
                education commence."
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button type="button" className="btnPrimary" onClick={() => navigate('/courses')}>
                  View the Prospectus
                </button>
                <button type="button" className="btnSecondary" onClick={() => navigate('/login')}>
                  Scholars' Portal
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </FadeInView>
    </SingleColumnLayout>
  );
};

const features = [
  {
    title: 'Course Management',
    description:
      'Teachers may create, draft, update, and publish courses with rich chapters, demo videos, and resources. Schedule publishing for future dates.',
  },
  {
    title: 'Community Building',
    description:
      'Public and private communities with fine-grained permissions. Teachers control who may post, and members engage in scholarly discourse.',
  },
  {
    title: 'Student Scheduling',
    description:
      'Students may build personal study schedules for each enrolled course, setting daily study targets and tracking adherence.',
  },
  {
    title: 'Progress Analytics',
    description:
      'Comprehensive dashboards for both teachers and students. Track chapters completed, streaks, learning hours, ratings, and revenue.',
  },
  {
    title: 'Secure Access',
    description:
      'Role-based permissions ensure that only authorised individuals may view, edit, or manage content. Unauthorised access is thwarted at every turn.',
  },
  {
    title: 'Victorian Experience',
    description:
      'A distinctive heraldic and Victorian-themed interface — from lamp-lit poles to gilded frames — designed to make learning an experience, not a chore.',
  },
];

export default AboutPage;
