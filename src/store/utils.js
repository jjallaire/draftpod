


// sum all the values within an object
export function sumValues(object) {
  return Object.keys(object)
    .map(val => object[val])
    .reduce((total, count) => total + count, 0);
}

export function deckList(deck) {
 
  let non_lands = deck.piles.slice(0, 6).flat();
  let special_lands = deck.piles[6];
  let sideboard = deck.piles[7];

  return [].concat(non_lands, special_lands, sideboard).map((card) => card.name);


}

/*
3 Carnage Tyrant
1 Cast Down
1 Elvish Rejuvenator
3 Find/Finality
8 Forest
1 Golgari Findbroker
4 Jadelight Ranger
4 Llanowar Elves
2 Memorial to Folly
4 Merfolk Branchwalker
2 Midnight Reaper
4 Overgrown Tomb
3 Ravenous Chupacabra
2 Seekers' Squire
5 Swamp
3 Vivien Reid
2 Vraska's Contempt
1 Vraska, Golgari Queen
2 Wildgrowth Walker
4 Woodland Cemetery

1 Cast Down
3 Deathgorge Scavenger
4 Duress
2 Golden Demise
1 Midnight Reaper
1 Plaguecrafter
1 The Eldest Reborn
2 Wildgrowth Walker
*/