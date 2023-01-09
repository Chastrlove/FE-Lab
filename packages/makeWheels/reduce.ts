const reduce = (collection, reducer, initValue?) => {
  let i = initValue ? 0 : 1;
  let value = initValue ?? collection[0];

  for (i; i < collection.length; i++) {
    const current = collection[i];
    value = reducer(value, current, i);
  }
  return value;
};

const arr1 = [1, 2, 3, 4, 5];
const sum = reduce(arr1, (prev, current) => {
  return prev + current;
},2);

console.log(sum);
