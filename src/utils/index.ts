export const sleep = async (duration: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), duration);
  });
};
