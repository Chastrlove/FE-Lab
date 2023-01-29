/*
export const quickSort = () => {
  const arr = [31, 44, 38, 5, 47, 15, 36,26, 27, 2, 46, 4, 19, 50, 18];
  const len = arr.length;
  quickSortHelper(arr, 0, len - 1);
  console.log(arr);
};

const quickSortHelper = (sortArrays, start, end) => {
  if (start < end) {
    let pivotIndex = partition(sortArrays, start, end);
    //已确保此时pivot的位置是正确的
    quickSortHelper(sortArrays, start, pivotIndex - 1);
    quickSortHelper(sortArrays, pivotIndex + 1, end);
  }
};

const partition = (sortArrays, left, right) => {
  // const pivot = sortArrays[left];
  // while (left < right) {
  //   while (sortArrays[right] >= pivot && left < right) {
  //     right--;
  //   }
  //   left < right && (sortArrays[left] = sortArrays[right]);
  //   while (sortArrays[left] <= pivot && left < right) {
  //     left++;
  //   }
  //   left < right && (sortArrays[right] = sortArrays[left]);
  // }
  // sortArrays[left] = pivot;
  // return left;

  //   let pivot = sortArrays[right];
  //   let i = left - 1;
  //   for (let j = left; j < right; j++) {
  //       if (sortArrays[j] < pivot) {
  //           i++;
  //           swap(sortArrays, i, j);
  //       }
  //   }
  //   swap(sortArrays, i + 1, right);
  //   return i + 1;
    const pivot = sortArrays[left];
    const  start = left;

    while (left < right) {
        while (left < right && sortArrays[right] >= pivot) right--;
        while (left < right && sortArrays[left] <= pivot) left++;
        if (left >= right) break;
        swap(sortArrays, left, right);
    }
    //基准值归位
    swap(sortArrays,start,left);
    return left;
};


quickSort();
*/

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
      //加left<right,是为了保证当跳出循环时，left刚好等于right,不会出现索引不正确或者溢出的问题
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

const arr = [-91, -96, -87, -90, -85];
const quickSort = (input) => {
  quickSortInternal(input, 0, input.length - 1);
  console.log(input);
};

quickSort(arr);
