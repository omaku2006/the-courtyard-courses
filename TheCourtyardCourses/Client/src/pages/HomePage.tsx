import SingleColumnLayout from '../components/layout/SingleColumnLayout';
import EthosBar from '../components/section/Hero/EthosBar';
import FacultyCard from '../components/section/Hero/FacultyCard';
import Hero from '../components/section/Hero/Hero';
import SuggestionCard from '../components/section/Hero/SuggestionCard';
import Testimonials from '../components/section/Hero/Testimonials';
import Newsletter from '../components/section/Hero/Newsletter.tsx';
import { useFetchCourses } from '../features/course/useCourse';
import { useFetchAllUser } from '../features/auth/useAuth';
import type { Course } from '../types/FetchDataTypes';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import FadeInView from '../components/ui/Animate';

const testimonalsData = [
  {
    id: 1,
    quote:
      'The Courtyard did not merely teach me history; it allowed me to live within it. The rigour of the curriculum is matched only by the dedication of the masters. My intellect has been forever sharpened.',
    name: 'Jonathan Hawkins',
    designation: 'Alumnus, Dept. of Letters (Class of 2024)',
  },
  {
    id: 2,
    quote:
      'I entered the institution as a mere enthusiast of architecture; I departed as a custodian of its principles. The classical foundations I acquired here are the bedrock of my present practice.',
    name: 'Clara Wellington',
    designation: 'Alumna, Dept. of Design (Class of 2023)',
  },
  {
    id: 3,
    quote:
      'A sanctuary for the modern scholar. The blend of Victorian scholarship and modern pedagogy is unparalleled. I found not just mentors, but lifelong friends within those gilded gates.',
    name: 'Edward Sterling',
    designation: 'Alumnus, Dept. of History (Class of 2024)',
  },
];

const HomePage = () => {
  const { data: coursesData, isLoading: coursesLoading } = useFetchCourses({ sortBy: 'newest' });
  const { data: usersData, isLoading: usersLoading } = useFetchAllUser();

  const courses = coursesData?.pages?.flatMap((p) => p.courses ?? []) ?? [];
  const publishedCourses = courses.filter((c: Course) => c.publishedAt);
  const displayCourses = publishedCourses.slice(0, 3);

  const allUsers = usersData?.users ?? [];
  const teachers = allUsers.filter((u: any) => u.role === 'teacher').slice(0, 3);

  return (
    <SingleColumnLayout>
      <Hero />
      <EthosBar />

      {/* Courses Section */}
      <section className="cardContainer flex flex-col justify-center items-center p-6 w-full my-10 min-h-[780px]">
        <FadeInView>
          <span className="px-4 py-2 bg-surface mb-6 italic">Departments of Study</span>
        </FadeInView>
        <FadeInView delay={0.1}>
          <h2 className="underline mb-10">-:The Faculties of Learning:-</h2>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="w-[80%] max-[600]:w-full mx-auto text-center">
            Mastery is not given, but earned through rigorous study. Peruse the prospectus and
            select the discipline wherein your intellect shall be forged.
          </p>
        </FadeInView>
        {coursesLoading ? (
          <div className="flex items-center gap-2 text-text-muted">
            <SpinnerGapIcon size={20} weight="bold" className="animate-spin" />
            <span className="font-heading text-sm italic">Gathering courses...</span>
          </div>
        ) : (
          <div className="flex max-w-[1780px] justify-between gap-6 max-[1180px]:flex-col max-[1180px]:w-1/2 max-[900px]:w-[80%]">
            {displayCourses.map((course: Course) => {
              return (
                <SuggestionCard key={course._id}>
                  <SuggestionCard.Header tag={course.category} title={course.title} />
                  <SuggestionCard.Body description={course.description} />
                  <SuggestionCard.Footer
                    duration={`${course.chapters?.length ?? 0} Chapters`}
                    level={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  />
                </SuggestionCard>
              );
            })}
          </div>
        )}
      </section>

      {/* Faculty Section */}
      <section className="facultiesContainer p-6 min-h-[780px] flex flex-col justify-center items-center">
        <FadeInView>
          <span className="px-4 py-2 bg-surface mb-6 italic">Meet the Academic Court</span>
        </FadeInView>
        <FadeInView delay={0.1}>
          <h2 className="text-center underline mb-10">-:The Learned Masters:-</h2>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="w-[80%] max-[600]:w-full mx-auto text-center">
            Our faculty are not merely educators, but custodians of history and lore. Dedicated
            scholars who have spent a lifetime traversing the corridors of antiquity, now guiding
            the next generation of thinkers.
          </p>
        </FadeInView>
        {usersLoading ? (
          <div className="flex items-center gap-2 text-text-muted">
            <SpinnerGapIcon size={20} weight="bold" className="animate-spin" />
            <span className="font-heading text-sm italic">Gathering faculty...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 max-w-[1780px] justify-between gap-6 max-[1180px]:grid-cols-1 max-[1180px]:w-1/2 max-[900px]:w-[80%]">
            {teachers.map((teacher: any) => (
              <FacultyCard key={teacher._id}>
                <FacultyCard.Avatar name={teacher.name} imageUrl={teacher.avatarImage?.url} />
                <FacultyCard.Name name={teacher.name} />
                <FacultyCard.Designation designation={teacher.occupation || 'Faculty'} />
                <hr className="w-full h-1 rounded-[2px] border-accent my-6" />
                <FacultyCard.Bio>
                  {teacher.description || 'Dedicated scholar of the Courtyard.'}
                </FacultyCard.Bio>
                <FacultyCard.Button username={teacher.username} />
              </FacultyCard>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="testimonialsContainer p-6 min-h-[780px] flex flex-col justify-center items-center">
        <FadeInView>
          <span className="px-4 py-2 bg-surface mb-6 italic">Words of Endorsement</span>
        </FadeInView>
        <FadeInView delay={0.1}>
          <h2 className="text-center underline mb-10">-:Voices from the Alumni:-</h2>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="w-[80%] max-[600]:w-full mx-auto text-center">
            Hear from those who have walked the cobblestone paths and emerged with minds sharpened
            and horizons broadened.
          </p>
        </FadeInView>
        <div className="flex max-w-[1780px] justify-between gap-6 max-[1180px]:flex-col max-[1180px]:w-1/2 max-[900px]:w-[80%] p-6">
          {testimonalsData.map((data) => (
            <Testimonials key={data.id}>
              <Testimonials.Quote>
                <p className="text-justify">{data.quote}</p>
              </Testimonials.Quote>
              <Testimonials.Name name={data.name} designation={data.designation} />
            </Testimonials>
          ))}
        </div>
      </section>
      <Newsletter />
    </SingleColumnLayout>
  );
};

export default HomePage;
