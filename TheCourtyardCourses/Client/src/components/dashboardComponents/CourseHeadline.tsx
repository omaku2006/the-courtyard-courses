const CourseHeadline = ({ title }: { title: string }) => {
  return (
    <div id="courseHeadline" className="bg-surface p-4">
      <h2>{title}</h2>
    </div>
  );
};

export default CourseHeadline;
