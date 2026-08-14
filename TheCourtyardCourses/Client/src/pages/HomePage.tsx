import SingleColumnLayout from '../components/layout/SingleColumnLayout';
import EthosBar from '../components/section/Hero/EthosBar';
import FacultyCard from '../components/section/Hero/FacultyCard';
import Hero from '../components/section/Hero/Hero';
import SuggestionCard from '../components/section/Hero/SuggestionCard';
import Testimonials from '../components/section/Hero/Testimonials';
import Newsletter from '../components/section/Hero/Newsletter.tsx';

const coursesData = [
  {
    id: 1,
    tag: 'Department of History',
    title: 'The Art of Heraldry',
    description:
      'Decode the lineage and symbols of the noble houses. Master the ancient rules of blazon, tinctures, and crest design from the royal scholars of the realm.',
    duration: '12-Week Programme',
    level: 'Foundation',
  },
  {
    id: 2,
    tag: 'Department of Letters',
    title: 'Victorian Literature',
    description:
      'Journey through the foggy streets of 19th-century London. Analyse the masterpieces of Dickens, the Brontë sisters, and Wilde within their purest historical context.',
    duration: '8-Week Programme',
    level: 'Intermediate',
  },
  {
    id: 3,
    tag: 'Department of Design',
    title: 'Classical Architecture',
    description:
      'From soaring Gothic spires to the symmetry of Georgian estates. Understand the mathematical perfection and imperial significance of historical design.',
    duration: '16-Week Programme',
    level: 'Advanced',
  },
];

const facultyData = [
  {
    id: 1,
    initials: 'A',
    username: 'arthur_blackwood',
    name: 'Prof. Arthur Pendelton',
    designation: 'Dean of Antiquities',
    bio: 'A renowned scholar of medieval history and feudal systems, holding a doctorate from the Royal College. He has spent two decades deciphering the lineage of forgotten noble houses.',
    buttonText: 'View Profile',
  },
  {
    id: 2,
    initials: 'E',
    username: 'eleanor_whitmore',
    name: 'Dr. Eleanor Vance',
    designation: 'Master of Letters',
    bio: 'A specialist in 19th-century gothic revival poetry and the intricate social dynamics of the Victorian era. Her lectures breathe life into the foggy streets of old London.',
    buttonText: 'View Profile',
  },
  {
    id: 3,
    initials: 'T',
    username: 'ravi_chandra',
    name: 'Thomas Sterling',
    designation: 'Surveyor of Architecture',
    bio: "An architect by trade, Thomas has spent thirty years documenting the restoration of Britain's grandest estates. He teaches the mathematical perfection of imperial design.",
    buttonText: 'View Profile',
  },
];

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
  return (
    <SingleColumnLayout>
      <Hero />
      <EthosBar />
      <section className="cardContainer flex flex-col justify-center items-center p-6 w-full my-10 min-h-[780px]">
        <span className="px-4 py-2 bg-surface mb-6 italic">Departments of Study</span>
        <h2 className="underline mb-10">-:The Faculties of Learning:-</h2>
        <p className="w-[80%] max-[600]:w-full">
          Mastery is not given, but earned through rigorous study. Peruse the prospectus and select
          the discipline wherein your intellect shall be forged.
        </p>
        <div className="flex max-w-[1780px] justify-between gap-6 max-[1180px]:flex-col max-[1180px]:w-1/2 max-[900px]:w-[80%]">
          {coursesData.map((data) => {
            return (
              <SuggestionCard>
                <SuggestionCard.Header tag={data.tag} title={data.title} />
                <SuggestionCard.Body description={data.description} />
                <SuggestionCard.Footer duration={data.duration} level={data.level} />
              </SuggestionCard>
            );
          })}
        </div>
      </section>
      <section className="facultiesContainer p-6 min-h-[780px] flex flex-col justify-center items-center">
        <span className="px-4 py-2 bg-surface mb-6 italic">Meet the Academic Court</span>
        <h2 className="text-center underline mb-10">-:The Learned Masters:-</h2>
        <p className="w-[80%] max-[600]:w-full">
          Our faculty are not merely educators, but custodians of history and lore. Dedicated
          scholars who have spent a lifetime traversing the corridors of antiquity, now guiding the
          next generation of thinkers.
        </p>
        <div className="flex max-w-[1780px] justify-between gap-6 max-[1180px]:flex-col max-[1180px]:w-1/2 max-[900px]:w-[80%]">
          {facultyData.map((data) => {
            return (
              <FacultyCard>
                <FacultyCard.Avatar name={data.initials} />
                <FacultyCard.Name name={data.name} />
                <FacultyCard.Designation designation={data.designation} />
                <hr className="w-full h-1 rounded-[2px] border-accent my-6" />
                <FacultyCard.Bio>{data.bio}</FacultyCard.Bio>
                <FacultyCard.Button username={data.username} />
              </FacultyCard>
            );
          })}
        </div>
      </section>

      <section className="testimonialsContainer p-6 min-h-[780px] flex flex-col justify-center items-center">
        <span className="px-4 py-2 bg-surface mb-6 italic">Words of Endorsement</span>
        <h2 className="text-center underline mb-10">-:Voices from the Alumni:-</h2>
        <p className="w-[80%] max-[600]:w-full">
          Hear from those who have walked the cobblestone paths and emerged with minds sharpened and
          horizons broadened.
        </p>
        <div className="flex max-w-[1780px] justify-between gap-6 max-[1180px]:flex-col max-[1180px]:w-1/2 max-[900px]:w-[80%] p-6">
          {testimonalsData.map((data) => {
            return (
              <Testimonials>
                <Testimonials.Quote>
                  <p className="text-justify">{data.quote}</p>
                </Testimonials.Quote>
                <Testimonials.Name name={data.name} designation={data.designation} />
              </Testimonials>
            );
          })}
        </div>
      </section>
      <Newsletter />
    </SingleColumnLayout>
  );
};

export default HomePage;
