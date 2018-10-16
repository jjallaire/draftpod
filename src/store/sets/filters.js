


export function rarityFilter(rarity) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && 
           !card.type_line.startsWith("Basic Land");
  }
}
