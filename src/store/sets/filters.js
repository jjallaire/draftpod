


export function rarityFilter(rarity, extraFilter = null) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && 
           !card.type_line.startsWith("Basic Land") &&
           (!extraFilter || extraFilter(card));
  }
}
