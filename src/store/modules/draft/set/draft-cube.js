

import * as filters from '../card-filters'

export function defaultCube(cardsInSet, multiples) {
  let mythics = cardsForCube(cardsInSet, filters.mythic, multiples.mythic);
  let rares = cardsForCube(cardsInSet, filters.rare, multiples.rare);
  let uncommons = cardsForCube(cardsInSet, filters.uncommon, multiples.uncommon);
  let commons = cardsForCube(cardsInSet, filters.common, multiples.common);
  return [].concat(
    mythics,
    rares,
    uncommons,
    commons
  );
}

export function cardsForCube(cardsInSet, filter, multiple) {
  let cubeCards = [];
  let cardset = cardsInSet.filter(filter);
  for (let i = 0; i<multiple; i++)
    cubeCards = cubeCards.concat(cardset);
  return cubeCards;
}



