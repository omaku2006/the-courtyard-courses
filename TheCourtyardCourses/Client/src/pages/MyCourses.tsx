import { PlusIcon, VideoIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import AddCourseForm from '../components/course/AddCourseForm';
import { useMyCourses, usePublishCourse } from '../features/course/useCourse';
import TeacherCourseCard from '../components/ui/TeacherCourseCard';

export type Course = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  thumbnail?: { url?: string | null; publicId?: string | null } | string | null;
  category?: string;
  level?: string;
  publishedAt?: string | null;
  price?: number;
};

const MyCourses = () => {
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  const { data, isLoading } = useMyCourses();
  const publishMutation = usePublishCourse();

  const courses: Course[] = data?.courses ?? [];

  const toggleForm = () => {
    setFormIsOpen(!formIsOpen);
  };

  const handlePublish = (courseId: string, publishedAt?: string | null) => {
    publishMutation.mutate({ courseId, publishedAt });
  };

  return (
    <section className="relative">
      <div className="myCourses">
        <div className="header flex items-center justify-between">
          <h2 className="flex items-center gap-5">
            <VideoIcon className="text-6xl" weight="fill" /> My Courses
          </h2>
          <button className="btnSecondary flex items-center gap-3" onClick={toggleForm}>
            <PlusIcon weight="fill" className="text-2xl" /> Add Course
          </button>
        </div>
        <hr className="rounded-[2px] mt-3 border-2" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-text-muted">Fetching your courses...</p>}

        {!isLoading && courses.length === 0 && (
          <p className="text-text-muted">No courses yet. Add your first course above!</p>
        )}

        {courses.map((course) => (
          <TeacherCourseCard
            key={course._id}
            course={course}
            onPublish={handlePublish}
            isPending={publishMutation.isPending}
          />
        ))}
      </div>

      {formIsOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-4">
          <div className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[4px] bg-surface">
            <button
              type="button"
              onClick={() => setFormIsOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 rounded-[4px] border-2 border-accent bg-surface p-2 text-text-primary transition-colors hover:bg-accent hover:text-light"
            >
              <XIcon size={20} weight="bold" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AddCourseForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyCourses;
