

import * as filters from '../card-filters'

export function build(cardsInSet, multiples) {
  let mythics = select(cardsInSet, filters.mythic, multiples.mythic);
  let rares = select(cardsInSet, filters.rare, multiples.rare);
  let uncommons = select(cardsInSet, filters.uncommon, multiples.uncommon);
  let commons = select(cardsInSet, filters.common, multiples.common);
  return [].concat(
    mythics,
    rares,
    uncommons,
    commons
  );
}

export function select(cardsInSet, filter, multiple) {
  let cubeCards = [];
  let cardset = cardsInSet.filter(filter);
  for (let i = 0; i<multiple; i++)
    cubeCards = cubeCards.concat(cardset);
  return cubeCards;
}



