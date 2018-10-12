
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    booster: [],
    deck: []
  },
  actions: {
    generateBooster(context) {
      axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
      .then(response => {
        // generate a unique index/key for each card
        let key=1;
        let booster = response.data.cards.map(card => {
          return { ...card, key: key++ };
        });
        context.commit('setBooster', booster);
      });
    },
    pickCard(context, card) {
      context.commit('addCardToDeck', card);
    }
  },
  getters: {
    booster: state => state.booster,
    deck: state => state.deck
  },
  mutations: {
    setBooster(state, cards) {
      state.booster = cards;
    },
    addCardToDeck(state, card) {
      state.booster.splice(state.booster.indexOf(card), 1);
      state.deck.push(card);
    }
  },
  strict: debug
});


