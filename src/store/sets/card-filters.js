


export function rare(card) {
  return rarity(["mythic", "rare"])(card);
}

export function uncommon(card) {
  return rarity(["uncommon"])(card);
}

export function common(card) {
  return rarity(["common"])(card);
}

export function basicLand(card) {
  return card.type_line.startsWith("Basic Land")
}

export function notOneOf(cards) {
  let ids = cards.map((card) => card.id);
  return function(card) {
    return ids.indexOf(card.id) === -1;
  }
}

function rarity(rarity) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && !basicLand(card);
  }
}
