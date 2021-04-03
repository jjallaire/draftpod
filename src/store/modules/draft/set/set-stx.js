

import * as cube from './cube'
import * as filters from '../card-filters'

export default {

  name: "Strixhaven",

  pack_cards: () => 15,

  expansion_set: true,
  is_custom_cube: true,

  cube: cube.build,

  booster(selectCards) {

    let cards = [].concat(
      selectCards(rareSlotNotArchive, 1),
      selectCards(uncommonNotArchive, 3),
      selectCards(commonNotLessonOrArchive, 9)
    );

    // mystical archive card, percentages from:
    // https://magic.wizards.com/en/articles/archive/feature/collecting-strixhaven-school-mages-2021-03-25
    const archiveRng = Math.random();
    if (archiveRng <= 0.67) {
      cards.push(...selectCards(uncommonMysticalArchive, 1))
    } else if (archiveRng <= (0.67 + 0.264)) {
      cards.push(...selectCards([rareMysticalArchvive,uncommonMysticalArchive], 1))
    } else {
      cards.push(...selectCards([mythicMysticalArchive,rareMysticalArchvive,uncommonMysticalArchive], 1))
    }

    // lesson card, no documentation on the percentages of these cards so using the same as mystical archive
    const lessonRng = Math.random();
    if (lessonRng <= 0.67) {
      cards.push(...selectCards([commonLesson,uncommonLesson], 1))
    } else if (lessonRng <= (0.67 + 0.264)) {
      cards.push(...selectCards([rareLesson,uncommonLesson,commonLesson], 1))
    } else {
      cards.push(...selectCards([mythicLesson,rareLesson,uncommonLesson,commonLesson], 1))
    }
    
    return cards;
  },
}

const commonNotLessonOrArchive = filters.join(filters.common, card => !lesson(card), card => !mysticalArchive(card));
const uncommonNotArchive = filters.join(filters.uncommon, card => !mysticalArchive(card));
const rareSlotNotArchive = filters.join(filters.packRareSlot, card => !mysticalArchive(card));

const uncommonMysticalArchive = filters.join(
  filters.uncommon,
  mysticalArchive
)

const rareMysticalArchvive = filters.join(
  filters.rare,
  mysticalArchive
)

const mythicMysticalArchive = filters.join(
  filters.mythic,
  mysticalArchive
)

function mysticalArchive(card) {
  return card.set === "sta";
}

const commonLesson = filters.join(
  filters.common,
  lesson
)

const uncommonLesson = filters.join(
  filters.uncommon,
  lesson
)


const rareLesson = filters.join(
  filters.rare,
  lesson
)

const mythicLesson = filters.join(
  filters.mythic,
  lesson
)

function lesson(card) {
  return card.type_line.endsWith("Lesson");
}




