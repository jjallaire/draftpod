

export function basicLand(card) {
  return card.type_line.startsWith("Basic Land")
}

export function rarity(rarity) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && !basicLand(card);
  }
}
