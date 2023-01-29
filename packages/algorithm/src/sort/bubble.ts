import { swap } from "../base";
export const bubble = (input: number[]) => {
  for (let i = 0; i < input.length; i++) {
    let flag = false;
    for (let j = 0; j < input.length - i; j++) {
      if (input[j] > input[j + 1]) {
        swap(input, j, j + 1);
        flag = true;//如果第一轮没找到需要交换的，说明是已排序的数组
      }
    }
    if (!flag) {
      break;
    }
  }
  return input;
};

