

import * as cube from './cube'
import * as filters from '../card-filters'


export default {

  name: "March of the Machine",

  pack_cards: () => 14,

  cube: cube.build,

  booster(selectCards) {

    let rare = selectCards(rareNonBattle, 1);
    const battle = selectCards(isBattle, 1);
    const uncommons = selectCards(uncommonNonTransform, 3);

    let numCommons = 9;    
    if (!isNonBattleTransform(rare)) {
      const flip = selectCards(isNonBattleTransform, 1);
      if (filters.rare(flip[0])) {
        rare[0] = flip[0];
      } else if (filters.uncommon(flip[0])) {
        uncommons[2] = flip[0];
      } else {
        numCommons = 8;
        uncommons.push(flip[0]);
      }
    }
    const commons = selectCards(isCommonNonTransform, numCommons);

    const cards = [].concat(
      ...rare,
      ...battle,
      ...uncommons,
      ...commons
    );

    console.log({
      cards: cards.length,
      rare: rare.length,
      battle: battle.length,
      uncommons: uncommons.length,
      commons: commons.length
    });


    return cards;
  },

}

function rareNonBattle(card) {
  return (filters.rare(card) || filters.mythic(card)) && !isBattle(card);
}

function uncommonNonTransform(card) {
  return filters.uncommon(card) && card.layout !== "transform";
}

function isBattle(card) {
  return card.type_line.startsWith("Battle");
}

function isNonBattleTransform(card) {
  return card.layout === "transform" && !isBattle(card);
}

function isCommonNonTransform(card) {
  return filters.common(card) && card.layout !== "transform";
}