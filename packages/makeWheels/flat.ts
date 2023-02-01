const animals = ["🐷", ["🐶", "🐂"], ["🐎", ["🐑", ["🐲"]], "🐛"]];
console.log(flatten(animals));

function flatten(list, depth = 2) {
  return depth === 0
    ? list
    : list.reduce((prev, current) => {
        return [...prev, ...(!Array.isArray(current) ? [current] : flatten(current, depth - 1))];
      }, []);
}
