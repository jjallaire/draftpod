

export function prettyDate(dt) {
  let date = new Date(dt);
  return date.toLocaleDateString() + ', ' +
          date.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
}

export function prettyNumber(x) {
  return (x).toLocaleString('en-US');
}




