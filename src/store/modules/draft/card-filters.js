


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
  return card.type_line.includes("Creature");
}

export function land(card) {
  return card.type_line.includes("Land");
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

export function multiverseID(id) {
  return function(card) {
    return card.id === id;
  }
}

function rarity(rarity) {
  return function(card) {
    return rarity.indexOf(card.rarity) >= 0 && !basicLand(card);
  }
}

