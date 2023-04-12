const throttle = (func: Function, delay: number) => {
  let prev = 0;

  return (...args: any) => {
    const now = Date.now();

    if (now - prev > delay) {
      prev = now;
      return func(...args);
    }

    return null;
  };
};

export default throttle;
