
// pick a card given deck and pack
export function pick(set_code, deck, pack) {
  let ratings = cardRatings(deck, pack);
  return ratings[0].card;
}


// determine the ratings for all cards in a pack
export function cardRatings(deck, pack) {

  // determine the colors used within the deck (2 colors with the
  // highest overall power-level)
  let deck_colors = deckColors(deck);

  // determine what percent of a card's colors must match for it to be 
  // considered 'on-color' and get a scaled color bonus. During pack 1
  // this will be 50% to account for more exploratory drafting. During
  // packs 2-3 this will be 66% (so that bots will still draft
  // 3-color cards)
  let color_bonus_factor_threshold = deck.length <= 14 ? 0.50 : 0.66;

  // color bonus escalates gradually over first 15 picks
  const color_bonus_levels = [0.0, 0.5, 0.6, 0.7, 1.0, 
                              1.0, 1.1, 1.2, 1.5, 1.6,
                              1.6, 1.7, 1.8, 2.0, 2.1];

  // synergy bonus escalates as cards w/ synergy are selected
  const synergy_bonus_levels = [0.0, 0.2, 0.5, 0.5, 0.5, 
                                0.7, 0.7, 0.8, 0.9, 1.0];

  // return ratings                               
  return pack

    // transform card to card w/ rating info
    .map((card) => {

      // set baseline for ratings
      let base_rating = card.rating;
      let synergy = null;
  
      // is the card on-color (color factor from 0 to 1)
      let color_bonus_factor = 0.0;
      let card_colors = card.colors;
      if (card_colors.length === 0) {
        // artifacts are always on-color but only get an 0.5 color factor
        // so that we don't over piack them
        color_bonus_factor = 0.5;
      } else {
        // how many of this card's colors match the deck colors?
        let matching_colors = card_colors.filter((color) =>
          deck_colors.indexOf(color) !== -1
        );
        // compute color factor (% of our colors that match the card colors)
        color_bonus_factor = (matching_colors.length / card_colors.length);

        // eliminate the color factor entirely if it doesn't achieve
        // a threshold ratio (> 0.5 in pack 1, > 0.66 in packs 2-3)
        if (color_bonus_factor < color_bonus_factor_threshold)
          color_bonus_factor = 0.0;
      }
      
      // if it's on-color then apply bonus (bonus levels increase gradually
      // over the first pack)
      let color_bounus_level = color_bonus_levels[
        Math.min(deck.length, color_bonus_levels.length-1)
      ];
      let color_bonus = color_bonus_factor * color_bounus_level;

      // check for synergy
      if (card.synergy) {
        
        // how many other cards in the deck share this synergy?
        let synergy_count = deck.filter((deck_card) => { 
          deck_card.synergy === card.synergy 
        }).length;

        // determine synergy bonus (escalates as more cards share the synergy)
        let synergy_bonus = synergy_bonus_levels[
          Math.min(synergy_count, synergy_bonus_levels.length-1)
        ];

        // apply the bonus if we have one
        if (synergy_bonus > 0) {
          synergy = {
            name: card.synergy,
            bonus: synergy_bonus
          }
        }
      }

      // return the card and the various components of the final adjusted rating
      return {
        card: card,
        base_rating: base_rating,
        color_bonus: color_bonus,
        synergy: synergy,
        rating: base_rating + color_bonus + (synergy ? synergy.bonus : 0)
      }
    })

    // order cards by rating
    .sort((a, b) => b.rating - a.rating);

}

// What are the colors of this deck? (multiply cards  of various colors by their
// rating and then return the top numColors)
export function deckColors(deck, numColors = 2) {

  let colorAffinity = deck.reduce((colors, card) => {
    card.colors.forEach((color) => {
      if (!colors.hasOwnProperty(color))
        colors[color] = 0;
      colors[color] += card.rating;
    });
    return colors;
  }, {});

  colorAffinity = Object.keys(colorAffinity).map((color) => {
    return {
      color: color,
      affinity: colorAffinity[color]
    }
  });

  return colorAffinity
    .sort((a,b) => b.affinity - a.affinity)
    .slice(0, numColors)
    .map((color) => color.color);   
}
