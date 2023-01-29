import { swap } from "../base";
export const quickSort = (input) => {
  quick(input, 0, input.length - 1);
  return input
};

const quick = (input, startIndex, endIndex) => {
  if (startIndex >= endIndex) {
    return;
  }
  const index = partition(input, startIndex, endIndex);
  quick(input, startIndex, index - 1);
  quick(input,index + 1,endIndex);
};

const partition = (input, startIndex, endIndex) => {
  const base = input[startIndex];
  let left = startIndex;
  let right = endIndex;
  while (left < right) {
    while (left < right && input[right] >= base) {
      right--;
    }
    if (left === right) {
      break;
    }
    swap(input, left, right);
    while (left < right && input[left] <= base) {
      left++; //左侧的小于等于基准值就跳过
    }
    if (left === right) {
      break;
    }
    swap(input, left, right);

  }
  return left;
};
