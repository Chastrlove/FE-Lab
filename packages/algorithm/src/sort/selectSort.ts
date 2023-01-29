import { swap } from "../base";
export const selectSort = (input: number[]) => {
  for (let i = 0; i < input.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < input.length; j++) {
      if (input[j] < input[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      swap(input, minIndex, i);
    }
  }
  return input;
};
