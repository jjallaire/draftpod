
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

  // return ratings                               
  return pack

    // transform card to card w/ rating info
    .map((card) => {
     
      // calculate the bonus levels
      let color_bonus = colorBonus(deck, deck_colors, card);
      
      // return the card and the various components of the final adjusted rating
      return {
        card: card,
        base_rating: card.rating,
        color_bonus: color_bonus,
        rating: card.rating + color_bonus
      }
    })

    // order cards by rating
    .sort((a, b) => {
      if (a.rating === b.rating)
        return b.color_bonus - a.color_bonus;
      else
        return b.rating - a.rating
    });

}

// What are the colors of this deck? (multiply cards of various colors by their
// rating and then return the top numColors). note that we only consider cards
// rated 1.5 or higher for this computtion
export function deckColors(deck, numColors = 2) {

  let colorAffinity = deck.reduce((colors, card) => {
    if (card.rating >= 1.5) {
      card.colors.forEach((color) => {
        if (!colors.hasOwnProperty(color))
          colors[color] = 0;
        colors[color] += card.rating;
      });
    }
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


function colorBonus(deck, deck_colors, card) {

  // determine what percent of a card's colors must match for it to be 
  // considered 'on-color' and get a scaled color bonus. During pack 1
  // this will be 50% to account for more exploratory drafting. During
  // packs 2-3 this will be 66% (so that bots will still draft
  // 3-color cards)
  const color_bonus_factor_threshold = deck.length <= 14 ? 0.50 : 0.66;

  // color bonus escalates gradually over first 15 picks
  const color_bonus_levels = [0.0, 0.5, 0.5, 0.5, 1.0, 
                              1.0, 1.0, 1.0, 1.5, 1.5,
                              1.5, 1.5, 1.5, 2.0, 2.0,
                              2.5, 2.5, 2.5, 3.0, 3.0];

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
    // a threshold ratio (>= 0.5 in pack 1, >= 0.66 in packs 2-3)
    if (color_bonus_factor < color_bonus_factor_threshold)
      color_bonus_factor = 0.0;
  }
  
  // calculate and return final color bonus
  let color_bounus_level = color_bonus_levels[
    Math.min(deck.length, color_bonus_levels.length-1)
  ];
  return color_bonus_factor * color_bounus_level;

}
