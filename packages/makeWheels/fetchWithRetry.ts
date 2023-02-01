const fetchWithRetry = async (url) => {
  const run = async (count) => {
    try {
      throw new Error("12312")
    } catch (e) {
      if (count === 3) {
        throw e;
      }
      return run(++count);
    }
  };
  return run(0);
};

fetchWithRetry("www.baidu.com");
