

export function pick(deck, pack) {

  // find the index of the highest rated card
  let highestIndex = pack.reduce((highestIndex, currentCard, currentIndex) => {
    if (currentCard.rating > pack[highestIndex].rating)
      return currentIndex;
    else
      return highestIndex;
  }, 0);

  return pack[highestIndex];

}
