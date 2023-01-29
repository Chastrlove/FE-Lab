const swap = (sortArrays, i, j) => {
  let temp = sortArrays[i];
  sortArrays[i] = sortArrays[j];
  sortArrays[j] = temp;
};
const quickSortInternal = (input, startIndex, endIndex) => {
  if (startIndex < endIndex) {
    const curIndex = partition(input, startIndex, endIndex);
    quickSortInternal(input, startIndex, curIndex - 1);
    quickSortInternal(input, curIndex + 1, endIndex);
  }
};

const partition = (input, startIndex, endIndex) => {
  let piv = input[startIndex];
  let left = startIndex;
  let right = endIndex;
  while (left < right) {
    while (left < right && input[right] >= piv) {
      right--; //右侧的大于等于基准值就跳过
    }
    if (left === right) {
      break;
    }
    swap(input, left, right);
    while (left < right && input[left] <= piv) {
      left++; //左侧的小于等于基准值就跳过
    }
    if (left === right) {
      break;
    }
    swap(input, left, right);
  }
  return left;
};
const arr = [5, 2, 3, 1];
const quickSort = (input) => {
  quickSortInternal(input, 0, input.length - 1);
  console.log(input);
};

quickSort(arr);
