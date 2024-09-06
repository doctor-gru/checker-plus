export const getCurrentTimeHr = () => {
  const [hrSecond, hrNanoSecond] = process.hrtime();
  return hrSecond * 1e9 + hrNanoSecond;
};
