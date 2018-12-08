
<script>

import NavBar from '@/components/core/NavBar.vue'

import ContentPanel from '@/components/core/ContentPanel.vue'
import SetSelect from '@/components/core/SetSelect.vue'

import { mapActions, mapMutations } from 'vuex'
import { CREATE_DRAFT } from '@/store/actions'
import { REMOVE_DRAFTS } from '@/store/mutations'
import { SIMULATE_DRAFT } from '@/store/modules/draft/mutations'

import { CARDPOOL } from '@/store/constants'

import { DECK } from '@/store/modules/draft/constants'
import * as draftbot from '@/store/modules/draft/draftbot'

import _flatten from 'lodash/flatten'
import _isEqual from 'lodash/isEqual'

export default {
  name: 'SimulatorPage',

  data: function() {
    return {
      set_code: 'grn',
      number: 100,
      decks: []
    }
  },

  computed: {
    percent_complete: function() {
      return (this.decks.length / 8) / this.number * 100;
    },
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

      let total_guilds = this.decks.length;
      return Object.keys(guilds)
        .map((key) => {
          let percent = +((guilds[key] / total_guilds) * 100).toFixed(2);
          return {
            name: key,
            count: guilds[key],
            percent: isNaN(percent) ? "0" : percent
          }
        })
        .sort((a, b) => b.count - a.count);
    },
    deck_colors: function() {
      let colors = { B: 0, U: 0, W: 0, R: 0, G: 0};
      _flatten(this.decks).forEach((c) => {
        colors[c]++;
      });

      let total_colors = 2 * this.decks.length;
      return Object.keys(colors)
        .map((key) => {
          let percent = +((colors[key] / total_colors) * 100).toFixed(2);
          return {
            name: key,
            count: colors[key],
            percent: isNaN(percent) ? "0" : percent
          }
        })
        .sort((a, b) => b.count - a.count);
    }
  },

  methods: {

    onSimulateDrafts() {
      
      // reset status
      this.decks = [];

      // run next simulation
      this.$nextTick(this.runNextSimulation);

    },

     runNextSimulation() {

      // create the draft
      this.createDraft({ 
        set_code: this.set_code, 
        cardpool: CARDPOOL.CUBE + '4/4/2/1', 
      }).then(({ draft_id }) => {

        // execute simulation
        this.$store.commit("drafts/" + draft_id + "/" + SIMULATE_DRAFT);

        // record the data
        let table = this.$store.state.drafts[draft_id].table;
        this.decks.push(draftbot.deckColors(_flatten(table.deck.piles.slice(0, DECK.PILES))));
        table.players.forEach((player) => {
          this.decks.push(draftbot.deckColors(player.picks.piles[0]));
        });

        // remove draft data
        this.removeDrafts([draft_id]);

        // schedule next execution if we need to
        let completed = this.decks.length / 8;
        if (completed < this.number)
          this.$nextTick(this.runNextSimulation);
      });

    },

    ...mapActions({
      createDraft: CREATE_DRAFT
    }),
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS
    }),
  },

  components: { NavBar, ContentPanel, SetSelect }
}


</script>


<template>

  <div>

  <NavBar /> 

  <div class="container">
    
    <ContentPanel caption="Simulate Drafts">
      <form>
        <SetSelect v-model="set_code" />
        <div class="form-group row">
          <label for="number-of-drafts" class="col-sm-3 col-form-label">Number of drafts:</label>
          <div class="col-sm-8">
            <input id="number-of-drafts" class="form-control" type="number" min="1" v-model.number="number"  />
          </div>
        </div>
        <br/>
        <div class="form-group row">
          <div class="col-sm-3">
            <button type="button" class="btn btn-success" @click="onSimulateDrafts">Start Simulations</button>
          </div>
          <div class="col-sm-8">
            <div class="progress bg-warning" :style="{ width: percent_complete + '%', height: '45px' }">
              <div class="progress-bar" role="progressbar" :aria-valuenow="percent_complete" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </form>
    </ContentPanel>

    <ContentPanel caption="Simulation Results">

      <div class="row">
        <div class="col-sm-5">
          <table class="table">
            <tbody>
              <tr v-for="guild in deck_guilds" :key="guild.name">
                <td>{{ guild.name }}</td> 
                <td align="center">{{ guild.count }}</td> 
                <td align="right">{{ guild.percent }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-sm-5 offset-sm-1">
          <table class="table">
            <tbody>
              <tr v-for="color in deck_colors" :key="color.name">
                <td>{{ color.name }}</td> 
                <td align="right">{{ color.count }}</td>
                <td align="right">{{ color.percent }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
    </ContentPanel>


  </div>

  </div>


</template>

<style>

#number-of-drafts {
  width: 50%;
}

</style>