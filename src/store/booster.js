

import uuidv4 from 'uuid'

const debug = process.env.NODE_ENV !== 'production'
const local_images = debug

export function generateBooster(cardpool) {

  // generate range of indexes then shuffle it
  let indexes = shuffleArray([...Array(cardpool.cards.length).keys()]);

  // function to draw next n cards of a rarity
  function drawCards(rarity, number) {
    let cards = [];
    for (let i=0; i<indexes.length; i++) {
      let index = indexes[i];
      let card = cardpool.cards[index];
      if (rarity.indexOf(card.rarity) >= 0 && !card.type_line.startsWith("Basic Land"))
        cards.push({...card, 
          key: uuidv4(), 
          image: local_images ? 
                  'sets/' + cardpool.set + '/' + card.id + '.png' :
                  card.image_uris.png,
        });
      if (cards.length >= number)
        break;
    }
    return cards;
  }

  return [].concat(
    drawCards(["mythic", "rare"], 1),
    drawCards(["uncommon"], 3),
    drawCards(["common"], 10)
  );
}


function shuffleArray(a) {
  let array = a.slice();
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


