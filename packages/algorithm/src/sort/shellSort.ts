export const shellSort = (input) => {
  let gap = Math.floor(input.length / 2);
  while (gap >= 1) {
    for (let i = gap; i < input.length; i = i + 1) {
      const base = input[i];
      let preIndex = i - gap;
      while (preIndex >= 0 && input[preIndex] > base) {
        input[preIndex + gap] = input[preIndex];
        preIndex = preIndex-gap;
      }
      input[preIndex + gap] = base;
    }
    gap = Math.floor(gap / 2);
  }
  return input
};
