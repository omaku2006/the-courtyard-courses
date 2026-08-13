const CourseHeadline = ({ title }: { title: string }) => {
  return (
    <div id="courseHeadline" className="bg-surface p-4 overflow-hidden">
      <h2 className="truncate min-w-0">{title}</h2>
    </div>
  );
};

export default CourseHeadline;
