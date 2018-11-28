

import * as selectors from '../selectors'


export function pick(deck, pack) {
  let top_rated = packRatings(deck, pack)[0];
  console.log(top_rated);
  return top_rated.card;
}


export function packRatings(deck, pack) {
  
  // filter playable cards
  let playables = deck
    .filter((card) => card.rating >= 1.5);

  // determine the top 2 colors among playables
  let deck_colors = selectors.cardColors(playables)
    .filter((color) => color.count > 0)
    .slice(0, 2)
    .map((color) => color.code);

  // color bonus escalates over first 12 picks
  const color_bonus_levels = [0.0, 0.0, 0.2, 0.4, 0.6, 
                              0.8, 1.0, 1.2, 1.4, 1.6,
                              1.8, 2.0];

  // synergy bonus levels
  const synergy_bonus_levels = [0.0, 0.1, 0.2, 0.4, 0.5, 
                                0.5, 0.6, 0.7, 0.8, 0.8];

  return pack
    .map((card) => {

      // set baseline for ratings
      let base_rating = card.rating;
      let color_bonus = 0;
      let synergy = null;
  
      // is the card on-color?
      let on_color = false;
      let card_colors = card.colors;
      if (card_colors.length === 0) {
        on_color = true;
      } else {
        let matching_colors = card_colors.filter((color) =>
          deck_colors.indexOf(color) !== -1
        );
        // match 2 out of 3 colors so draft AI picks 3-color cards
        on_color = (matching_colors.length / card_colors.length) >= 0.66;
      }
      
      // if it's on-color then apply escalating color bonus
      if (on_color)
        color_bonus = color_bonus_levels[Math.min(deck.length, color_bonus_levels.length-1)];

      // check for synergy
      if (card.synergy) {
        let synergy_count = playables.filter((playable) => playable.synergy === card.synergy).length;
        let synergy_bonus = synergy_bonus_levels[Math.min(synergy_count, synergy_bonus_levels.length-1)];
        if (synergy_bonus > 0) {
          synergy = {
            name: card.synergy,
            bonus: synergy_bonus
          }
        }
      }

      return {
        card: card,
        base_rating: base_rating,
        color_bonus: color_bonus,
        synergy: synergy,
        rating: base_rating + color_bonus + (synergy ? synergy.bonus : 0)
      }
    })
    .sort((a, b) => b.rating - a.rating);

}
