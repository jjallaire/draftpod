

import * as cube from './cube'
import * as filters from '../card-filters'

export default {

  name: "Strixhaven",

  pack_cards: () => 15,

  expansion_set: true,
  is_custom_cube: true,

  cube: cube.build,

  booster(selectCards) {

    const rares = selectCards(rareSlotNotArchive, 1);
    const uncommons = selectCards(uncommonNotArchive, 3);
    const commons = selectCards(commonNotLessonOrArchive, 9);
    
    function appendCard(card) {
      if (filters.common(card)) {
        commons.push(card);
      } else if (filters.uncommon(card)) {
        uncommons.push(card);
      } else {
        rares.push(card);
      }
    }

    // mystical archive card, percentages from:
    // https://magic.wizards.com/en/articles/archive/feature/collecting-strixhaven-school-mages-2021-03-25
    let archive = undefined;
    const archiveRng = Math.random();
    if (archiveRng <= 0.67) {
      archive = selectCards(uncommonMysticalArchive, 1)[0];
    } else if (archiveRng <= (0.67 + 0.264)) {
      archive = selectCards([rareMysticalArchvive,uncommonMysticalArchive], 1)[0];
    } else {
      archive = selectCards([mythicMysticalArchive,rareMysticalArchvive,uncommonMysticalArchive], 1)[0];
    }
    if (archive) {
      appendCard(archive)
    }

    // lesson card, no documentation on the percentages of these cards so using the same as mystical archive
    let lesson = undefined;
    const lessonRng = Math.random();
    if (lessonRng <= 0.67) {
      lesson = selectCards([commonLesson,uncommonLesson], 1)[0];
    } else if (lessonRng <= (0.67 + 0.264)) {
      lesson = selectCards([rareLesson,uncommonLesson,commonLesson], 1)[0];
    } else {
      lesson = selectCards([mythicLesson,rareLesson,uncommonLesson,commonLesson], 1)[0];
    }
    if (lesson) {
      appendCard(lesson)
    }

    return [].concat(rares, uncommons, commons);
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




