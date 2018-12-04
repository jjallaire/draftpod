
<script>

import NavBar from '@/components/core/NavBar.vue'

import ContentPanel from '@/components/core/ContentPanel.vue'
import SelectSet from '@/components/draft/core/SelectSet.vue'
import SelectCardpool from '@/components/draft/core/SelectCardpool.vue'

import { mapActions, mapMutations } from 'vuex'
import { CREATE_DRAFT } from '@/store/actions'
import { REMOVE_DRAFTS } from '@/store/mutations'
import { SIMULATE_DRAFT } from '@/store/modules/draft/mutations'

import { DECK } from '@/store/modules/draft/constants'
import * as draftbot from '@/store/modules/draft/draftbot'

import _flatten from 'lodash/flatten'
import _isEqual from 'lodash/isEqual'

export default {
  name: 'SimulatorPage',

  data: function() {
    return {
      set_code: 'grn',
      cardpool: '4/3/2/1',
      number: 3,
      decks: []
    }
  },

  computed: {
    deck_guilds: function() {
      let guilds = {
        izzet: 0,
        dimir: 0,
        boros: 0,
        golgari: 0,
        selesnya: 0,
        azorius: 0,
        gruul: 0,
        orzhov: 0,
        rakdos: 0,
        simic: 0,
      };
      let decks = this.decks;
      decks.forEach((deck) => {
        deck = deck.slice().sort();
        if (_isEqual(deck, ["R", "U"]))
          guilds['izzet']++;
        else if (_isEqual(deck, ["B", "U"]))
          guilds['dimir']++;
        else if (_isEqual(deck, ["R", "W"]))
          guilds['boros']++;
        else if (_isEqual(deck, ["B", "G"]))
          guilds['golgari']++;
        else if (_isEqual(deck, ["G", "W"]))
          guilds['selesnya']++;
        else if (_isEqual(deck, ["U", "W"]))
          guilds['azorius']++;
        else if (_isEqual(deck, ["G", "R"]))
          guilds['gruul']++;
        else if (_isEqual(deck, ["B", "W"]))
          guilds['orzhov']++;
        else if (_isEqual(deck, ["B", "R"]))
          guilds['rakdos']++;
        else if (_isEqual(deck, ["G", "U"]))
          guilds['simic']++;
      });

      return Object.keys(guilds)
        .map((key) => {
          return {
            name: key,
            count: guilds[key]
          }
        })
        .sort((a, b) => b.count - a.count);
    },
    deck_colors: function() {
      let colors = { B: 0, U: 0, W: 0, R: 0, G: 0};
      _flatten(this.decks).forEach((c) => {
        colors[c]++;
      });

      return Object.keys(colors)
        .map((key) => {
          return {
            name: key,
            count: colors[key]
          }
        })
        .sort((a, b) => b.count - a.count);
    }
  },

  methods: {
    onSimulateDrafts() {
      
      // reset status
      this.decks = [];

      // create a set of promises for the simulations
      let simulations = [];
      for (let i=0; i<this.number; i++) {
        simulations.push(new Promise((resolve) => {
          this.createDraft({ 
            set_code: this.set_code, 
            cardpool: this.cardpool, 
          }).then(({ draft_id } ) => { resolve(draft_id) } )
        }));
      }

      // wait until they are all created
      Promise.all(simulations).then((drafts) => {

        console.log("Drafts Created");

        drafts.forEach((draft_id) => {

          this.$store.commit("drafts/" + draft_id + "/" + SIMULATE_DRAFT);

          // record the data
          let table = this.$store.state.drafts[draft_id].table;
          this.decks.push(draftbot.deckColors(_flatten(table.deck.piles.slice(0, DECK.PILES))));
          table.players.forEach((player) => {
            this.decks.push(draftbot.deckColors(player.picks.piles[0]));
          });

          // remove draft data
          this.removeDrafts([draft_id]);

          // status
          console.log(draft_id + ' (' + (this.decks.length / 8) + '/' + drafts.length + ')');
        });
      })
    },

    ...mapActions({
      createDraft: CREATE_DRAFT
    }),
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS
    }),
  },

  components: { NavBar, ContentPanel, SelectSet, SelectCardpool }
}


</script>


<template>

  <div>

  <NavBar /> 

  <div class="container">
    
    <ContentPanel caption="Simulate Drafts">
      <form>
        <SelectSet v-model="set_code" />
        <SelectCardpool v-model="cardpool" />
        <div class="form-group row">
          <label for="number-of-drafts" class="col-sm-3 col-form-label">Number of drafts:</label>
          <div class="col-sm-8">
            <input id="number-of-drafts" class="form-control" type="number" min="1" v-model.number="number"  />
          </div>
        </div>
        <br/>
        <div class="form-group row">
          <div class="col-sm-10">
          <button type="button" class="btn btn-success" @click="onSimulateDrafts">Start Simulations</button>
        </div>
    </div>
      </form>
    </ContentPanel>

    <ContentPanel caption="Simulation Results">
      <table class="table" style="width: 50%;">
        <tbody>
          <tr v-for="guild in deck_guilds" :key="guild.name">
            <td>{{ guild.name }}</td> <td>{{ guild.count }}</td>
          </tr>
        </tbody>
      </table>
    
      <br/>

      <table class="table" style="width: 50%;">
        <tbody>
          <tr v-for="color in deck_colors" :key="color.name">
            <td>{{ color.name }}</td> <td>{{ color.count }}</td>
          </tr>
        </tbody>
      </table>

    </ContentPanel>


  </div>

  </div>


</template>

<style>

#number-of-drafts {
  width: 50%;
}

</style>