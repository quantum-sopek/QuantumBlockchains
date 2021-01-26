export const wait = (predicate: () => boolean, timeInMilliseconds: number) => {
  const checkFunction = (resolve: (value?: unknown) => void) => {
    if (predicate()) {
      resolve();
    } else {
      setTimeout(() => checkFunction(resolve), timeInMilliseconds);
    }
  }
  return new Promise(checkFunction);
};
