


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

function rarity(rarity) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && !basicLand(card);
  }
}
