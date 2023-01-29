export const insertSort = (input) => {
  for (let i = 1; i < input.length; i++) {
    const base = input[i];
    let preIndex = i - 1;
    while (preIndex >= 0 && input[preIndex] > base) {
      input[preIndex + 1] = input[preIndex];
      preIndex--;
    }
    input[preIndex+1] = base
  }
  return input
};
