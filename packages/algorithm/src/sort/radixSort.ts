export const radixSort = (array) => {
  const counter: Array<Array<number>> = [];
  let mod = 10;
  let dev = 1;
  let zeroCount = 0;
  while (true) {
    if (zeroCount === array.length) {
      break;
    } else {
      zeroCount = 0;
    }
    for (let j = 0; j < array.length; j++) {
      const bucket = parseInt((array[j] % mod) / dev);
      if (!counter[bucket]) {
        counter[bucket] = [array[j]];
      } else {
        counter[bucket].push(array[j]);
      }
      if (bucket === 0) {
        zeroCount++;
      }
    }
    let pos = 0;
    for (let j = 0; j < counter.length; j++) {
      while (counter[j] && counter[j].length > 0) {
        array[pos] = counter[j].shift();
        pos++;
      }
    }
    (dev *= 10), (mod *= 10);
  }
  return array
};
