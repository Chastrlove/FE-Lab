export const dichotomy = (list: number[], num: number) => {
  let left = 0;
  let right = list.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    if(list[middle] === num){
      console.log(middle);
      break
    }
    if (list[middle] > num) {
      right = middle - 1;
    } else {
      left = middle + 1;
    }
  }
};

dichotomy([1, 2, 4, 5, 6, 7, 8, 10], 2);
