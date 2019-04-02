


export function packRareSlot(card) {
  if (Math.random() <= (1/8)) {
    return mythic(card);
  } else {
    return rare(card);
  }
}

export function rare(card) {
  return rarity(["rare"])(card);
}

export function mythic(card) {
  return rarity(["mythic"])(card);
}

export function uncommon(card) {
  return rarity(["uncommon"])(card);
}

export function common(card) {
  return rarity(["common"])(card);
}

export function creature(card) {
  if (card.type_line)
    return card.type_line.includes("Creature");
  else
    return false;
}

export function land(card) {
  if (card.type_line)
    return card.type_line.includes("Land") && !card.type_line.includes("//");
  else
    return false;
}

export function basicLand(card) {
  if (card.type_line)
    return card.type_line.startsWith("Basic Land");
  else
    return false;
}

export function notOneOf(cards) {
  let ids = cards.map((card) => card.id);
  return function(card) {
    return ids.indexOf(card.id) === -1;
  }
}

export function multiverseID(id) {
  return function(card) {
    return card.id === id;
  }
}

export function rarity(rarity) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && !basicLand(card);
  }
}

export function join() {
  let filters = arguments;
  return function(card) {
    for (let i=0; i<filters.length; i++) {
      let filter = filters[i];
      if (!filter(card))
        return false;
    }
    return true;
  }
}