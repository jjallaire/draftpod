


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
  return typeLine("Creature")(card);
}

export function planeswalker(card) {
  return typeLine("Planeswalker")(card);
}

export function instant(card) {
  return typeLine("Instant")(card);
}

export function sorcery(card) {
  return typeLine("Sorcery")(card);
}

export function enchantment(card) {
  return typeLine("Enchantment")(card);
}

export function artifact(card) {
  return typeLine("Artifact")(card);
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

export function plains(card) {
  return card.colors.includes('W');
}

export function island(card) {
  return card.colors.includes('U');
}

export function swamp(card) {
  return card.colors.includes('B');
}

export function mountain(card) {
  return card.colors.includes('R');
}

export function forest(card) {
  return card.colors.includes('G');
}

export function colorless(card) {
  return card.colors.length === 0;
}

export function multicolor(card) {
  return card.colors.length > 1;
}

export function cmc(cost) {
  return function(card) {
    if (typeof cost === 'number')
      return card.cmc === cost;
    else 
      return cost(card.cmd);
  }
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

export function typeLine(type) {
  return function(card) {
    if (card.type_line) {
      return card.type_line.includes(type);
    } else {
      return false;
    }
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