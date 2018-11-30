

import * as filters from '../card-filters'


export const basicLand = [].concat(
  filters.basicLand
)

export const common = [].concat(
  filters.common,
)

export const uncommon = [].concat(
  filters.uncommon,
  common
)

export const rare = [].concat(
  filters.rare,
  uncommon
)

export const mythic = [].concat(
  filters.mythic,
  rare
)

export const packRareSlot = [].concat(
  filters.packRareSlot,
  uncommon
)

