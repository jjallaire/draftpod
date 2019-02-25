
// create a new draft bot
export function create() {
  return {
    // does the bot have a color preference?
    color_preference: {
      color: sampleFrom([...new Array(15).fill(null), 'R', 'W', 'G', 'B', 'U']),
      picks: sampleFrom([4, 5, 6])
    },

    color_behavior: {
      // at what pick do we start giving on-color cards a +0.5 bonus?
      bias_threshold: sampleFrom([3, 3, 5, 5]),

      // at what pick do we start not considering off-color cards at all?
      lock_threshold: sampleFrom([6, 6, 8, 8, 10, 10, 15]),
    },

    // variance for distribution of ratings
    variance: sampleFrom([0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1, 0.2])

  };
}

// create a 'default' auto-pick bot
export function createAutoPicker() {
  return {
    color_preference: null,
    color_behavior: {
      bias_threshold: 7,
      lock_threshold: 20,
    },
    variance: 0
  };
}

// pick a card given deck and pack
export function pick(bot, deck, pack) {
  let ratings = cardRatings(bot, deck, pack, false);
  return ratings[0].card;
}

// determine the ratings for all cards in a pack
export function cardRatings(bot, deck, pack, display) {

  // determine the colors used within the deck (2 colors with the
  // highest overall power-level)
  let deck_colors = deckColors(deck);

  // how many picks have we made?
  let pick_number = deck.length + 1;

  // function to compare ratings (breaking ties w/ the color_bonus)
  function compareRatings(a, b) {
    if (a.rating === b.rating)
      return b.color_bonus - a.color_bonus;
    else
      return b.rating - a.rating;
  }

  // function to adjust card ratings (i.e. give them some variance to 
  // simulate disagreement on card evaluation)
  function adjustedRating(card) {
   
    // apply some variance to card evaluation
    let rating = normalRandom(card.rating, bot.variance);

    // bias to preferred color in early picks
    if (bot.color_preference) {
      if (pick_number <= bot.color_preference.picks &&
          card.colors.indexOf(bot.color_preference.color) !== -1) {
        rating += 1.0;
      }
    }

    // return adjusted rating
    return rating;
  }

  // return ratings                               
  return pack

    // transform card to card w/ rating info
    .map((card) => {
     
      // calculate the bonus levels
      let color_bonus = colorBonus(deck, deck_colors, card);

      // provide a color bias past a certain threshold
      if (pick_number >= bot.color_behavior.bias_threshold) {
        if (color_bonus > 0)
          color_bonus += 0.5;
      }
      
      // return the card and the various components of the final adjusted rating
      let rating = adjustedRating(card);
      return {
        card: card,
        base_rating: rating,
        color_bonus: color_bonus,
        rating: rating + color_bonus
      }
    })

    // order cards by rating with some adjustments for color commitment
    // and rare-drafting
    .sort((a, b) => {
      
      
      // if this is for display then we always use the straight rating
      if (display) {

        return compareRatings(a, b);
      
      // otherwise make adjustments to the bot behavior as appropriate
      } else {

        // if we see a ~ top 10 card we will always take it
        if (a.base_rating >= 4.5 || b.base_rating >= 4.5)
          return b.base_rating - a.base_rating;

        // before pick ~ 20 we'll just compare the ratings
        else if (pick_number <= bot.color_behavior.lock_threshold)
          return compareRatings(a, b);
    
        // otherwise, after ~ pick 20 we will refuse to order 
        // a card without a color bonus above one with a color bonus
        else if (b.color_bonus == 0 && a.color_bonus !== 0)
          return -1;
        else if (a.color_bonus == 0 && b.color_bonus !== 0)
          return 1;
        else
          return compareRatings(a, b);
      }
    });

}

// What are the colors of this deck? (multiply cards of various colors by their
// rating and then return the top numColors). note that we only consider cards
// rated 1.5 or higher for this computation
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
    // so that we don't over pick them
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


// function to yield a number from normal random distribution
function normalRandom(mean, variance) {
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

function sampleFrom(arr) {
  let index = Math.floor(Math.random() * arr.length);
  index = Math.min(index, arr.length - 1);
  return arr[index];
}