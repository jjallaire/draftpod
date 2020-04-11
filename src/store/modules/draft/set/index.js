



import kld from './set-kld'
import aer from './set-aer'
import akh from './set-akh'
import hou from './set-hou'
import dom from './set-dom'
import m19 from './set-m19'
import grn from './set-grn'
import rna from './set-rna'
import ust from './set-ust'
import xln from './set-xln'
import rix from './set-rix'
import war from './set-war'
import m20 from './set-m20'
import mh1 from './set-mh1'
import ktk from './set-ktk'
import isd from './set-isd'
import eld from './set-eld'
import thb from './set-thb'
import iko from './set-iko'

import cube_gnt from './cube-gnt'
import cube_vintage_2019 from './cube-vintage-2019'
import cube_vintage_2020 from './cube-vintage-2020'

import axios from 'axios'
 
import { CARDPOOL } from '../../../constants'

const sets = {
  akh,
  aer,
  kld,
  hou,
  dom,
  m19,
  grn,
  rna,
  ust,
  xln,
  rix,
  war,
  m20,
  mh1,
  ktk,
  isd,
  eld,
  thb,
  iko,
  cube_gnt,
  cube_vintage_2019,
  cube_vintage_2020
}

const cards_cache = {
  // download cards for set once per browser session
};

export function name(set_code) {
  return sets[set_code].name;
}

export function is_custom_cube(set_code) {
  return sets[set_code].is_custom_cube || false;
}

export function is_edition(set_code, edition) {
  let is_edition = sets[set_code].is_edition;
  if (is_edition)
    return is_edition(edition);
  else
    return name(set_code) === edition;
}

export function default_cube(set_code) {
  if (sets[set_code].default_cube) {
    return sets[set_code].default_cube;
  } else {
    return CARDPOOL.CUBE + '4/4/1/1';
  }
}

export function cardpool_basics(set_code) {
  return sets[set_code].cardpool_basics || [];
}

export function capabilities(set_code) {
  
  let default_capabilities = {
    arena_decklists: true,
    custom_cardpool: true
  }

  if (sets[set_code].capabilities) {
    return {
      ...default_capabilities,
      ...sets[set_code].capabilities
    }
  } else {
    return default_capabilities;
  }
} 

export function card_id_filter(set_code, id) {
  let filter = sets[set_code].card_id_filter;
  if (filter)
    return filter(id);
  else 
    return id;
}

export function expansion_set(set_code) {
  if (sets[set_code].expansion_set) {
    return sets[set_code].expansion_set;
  } else {
    return false;
  }
}

export function pack_set(set_code, pack_number) {
  let pack_set = sets[set_code].pack_set;
  if (pack_set)
    return pack_set(pack_number);
  else
    return set_code;
}

export function pack_cards(set_code, number_of_packs) {
  return sets[set_code].pack_cards(number_of_packs);
}

export function cards(set_code) {
  if (cards_cache[set_code]) {
    return Promise.resolve(cards_cache[set_code]);
  } else {
    return axios.get('/sets/' + set_code + '/cards.json')
      .then(response => {
        cards_cache[set_code] = response.data;
        return cards_cache[set_code];
      });
  }
}

// synchronous fetch of cards (should only be called from within the
// table page where we are guaranteed to have the cards available)
export function cards_cached(set_code) {
  if (cards_cache[set_code])
    return (cards_cache[set_code]);
  else
    throw new Error("Cached cards not available for set " + set_code);
}

export function cube(set_code, cardsInSet, multiples) {
  return sets[set_code].cube(cardsInSet, multiples);
}

export function booster(set_code, cards, number_of_packs, pack_number) {
  return sets[set_code].booster(cards, number_of_packs, pack_number);
}


