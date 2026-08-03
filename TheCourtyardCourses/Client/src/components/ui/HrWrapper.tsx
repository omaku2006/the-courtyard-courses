const HrWrapper = ({ name, className }: { name: string; className?: string }) => {
  return (
    <div className="estdWrapper w-full flex items-center justify-evenly gap-3 my-3">
      <hr className={`${className} w-full border-accent`} />
      <h5 className="text-nowrap">{name}</h5>
      <hr className={`${className} w-full border-accent`} />
    </div>
  );
};

export default HrWrapper;
