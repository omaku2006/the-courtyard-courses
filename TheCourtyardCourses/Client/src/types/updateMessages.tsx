export const getRandom = (min: number, max: number, isInt = true): number => {
  const num = Math.random() * (max - min) + min;
  return isInt ? Math.floor(num) : num;
};
