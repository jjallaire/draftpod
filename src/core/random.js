

// function to yield a number from normal random distribution
export function normalRandom(mean, variance) {
  let v1, v2, s;
  do {
    let u1 = Math.random();
    let u2 = Math.random();
    v1 = 2 * u1 - 1;
    v2 = 2 * u2 - 1;
    s = v1 * v1 + v2 * v2;
  } while (s > 1);
  let x = Math.sqrt(-2 * Math.log(s) / s) * v1;
  x = mean + Math.sqrt(variance) * x;
  return x;
}

export function sampleFrom(arr, value = true) {
  let index = Math.floor(Math.random() * arr.length);
  index = Math.min(index, arr.length - 1);
  if (value)
    return arr[index];
  else
    return index;  
}