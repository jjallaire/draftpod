

export function flatten2d(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}
