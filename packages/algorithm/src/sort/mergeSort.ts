const mergeSortRec = (input, startIndex, lastIndex) => {
  if (startIndex === lastIndex) {
    return [input[startIndex]];
  }
  const middle = Math.floor((startIndex + lastIndex) / 2);
  const left = mergeSortRec(input, startIndex, middle);
  const right = mergeSortRec(input, middle + 1, lastIndex);
  return merge(left, right);
};

const merge = (left, right) => {
  let leftIndex = 0;
  let rightIndex = 0;
  const newList: number[] = [];
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] > right[rightIndex]) {
      newList.push(right[rightIndex]);
      rightIndex++;
    } else {
      newList.push(left[leftIndex]);
      leftIndex++;
    }
  }
  while (leftIndex < left.length) {
    newList.push(left[leftIndex]);
    leftIndex++;
  }
  while (rightIndex < right.length) {
    newList.push(right[rightIndex]);
    rightIndex++;
  }
  return newList;
};

export const mergeSort = (input: number[]) => {
  return mergeSortRec(input, 0, input.length - 1);
};
