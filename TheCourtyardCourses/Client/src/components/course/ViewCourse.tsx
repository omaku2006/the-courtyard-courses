import { useParams } from 'react-router-dom';
import { useFetchCourse } from '../../features/course/useCourse';
import LoadingPage from '../../pages/system/LoadingPage';
import ServerErrorPage from '../../pages/system/ServerErrorPage';
import CourseHeadline from '../dashboardComponents/CourseHeadline';
import CourseTeacher from '../dashboardComponents/CourseTeacher';
import CourseChapterInfo from '../dashboardComponents/CourseChapterInfo';
import CourseCommunity from '../dashboardComponents/CourseCommunity';
import CourseVideo from '../dashboardComponents/CourseVideo';
import CourseDescription from '../dashboardComponents/CourseDescription';
import CourseReview from '../dashboardComponents/CourseReview';
import CourseChapterProgress from '../dashboardComponents/CourseChapterProgress';
import { useState } from 'react';

const ViewCourse = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useFetchCourse(slug ?? '');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const course = data?.courseDetails;

  if (isLoading) return <LoadingPage />;
  if (isError || !course) return <ServerErrorPage />;
  return (
    <section id="course" className="gap-4 p-4 content-start">
      <CourseHeadline title={course.title} />
      <CourseTeacher course={course} />
      <CourseChapterInfo
        course={course}
        selectChapter={selectedChapter}
        setSelectChapter={setSelectedChapter}
      />
      <CourseCommunity />
      <CourseVideo course={course} selectedChapter={selectedChapter} />
      <CourseDescription />
      <CourseReview />
      <CourseChapterProgress />
    </section>
  );
};

export default ViewCourse;
