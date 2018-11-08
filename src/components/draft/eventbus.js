

import Vue from 'vue';
export const EventBus = new Vue();

export const Events = {
  ViewCard: 'mtgdraft-view-card',

  CardPackToPick: 'mtgdraft-card-pack-to-pick',
  CardPileToPile: 'mtgdraft-card-pile-to-pile',
  CardSideboardToDeck: 'mtgdraft-card-sideboard-to-deck',

  LandsAutoApply: 'mtgdraft-lands-auto-apply',
  LandsAutoDisable: 'mtgdraft-lands-auto-disable',
  LandsChanged: 'mtgdraft-lands-changed'
};

