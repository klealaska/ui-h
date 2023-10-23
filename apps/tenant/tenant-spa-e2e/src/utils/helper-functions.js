function lte(item1, item2) {
  return item1 <= item2;
}

function gte(item1, item2) {
  return item1 >= item2;
}

export function checkSort(array, direction) {
  const fn = direction === 'asc' ? gte : lte;
  return array.every((el, idx, arr) => !idx || fn(el, arr[idx - 1]));
}
