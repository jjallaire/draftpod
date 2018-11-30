

import * as filters from '../card-filters'

// some articles on building set cubes:
//
// https://www.channelfireball.com/articles/cube-design-set-cubes/
// http://www.metamox.com/blog/9-things-you-need-to-know-about-how-to-make-a-set-cube/


export function build(cardsInSet, multiples) {
  let mythics = select(cardsInSet, filters.mythic, multiples.mythic);
  let rares = select(cardsInSet, filters.rare, multiples.rare);
  let uncommons = select(cardsInSet, filters.uncommon, multiples.uncommon);
  let commons = select(cardsInSet, filters.common, multiples.common);
  let lands = select(cardsInSet, filters.basicLand, multiples.common * 3);
  return [].concat(
    mythics,
    rares,
    uncommons,
    commons,
    lands
  );
}

export function select(cardsInSet, filter, multiple) {
  let cubeCards = [];
  let cardset = cardsInSet.filter(filter);
  for (let i = 0; i<multiple; i++)
    cubeCards = cubeCards.concat(cardset);
  return cubeCards;
}



