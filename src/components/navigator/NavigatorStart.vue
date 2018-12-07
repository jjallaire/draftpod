<script>

import ContentPanel from '@/components/core/ContentPanel.vue'
import SetSelect from '@/components/core/SetSelect.vue'
import CardpoolSelect from '@/components/core/cardpool/CardpoolSelect.vue'

// eslint-disable-next-line 
import { store } from '@/store'
import { CARDPOOL } from '@/store/constants'
import { UPDATE_PREFERENCES } from '@/store/mutations'
import { CREATE_DRAFT } from '@/store/actions'

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'NavigatorStart',

  data: function() {
    return {
      set_code: 'grn',
      cardpool: CARDPOOL.CUBE + '4/4/1/1',
      pick_timer: true,
      pick_ratings: false
    }
  },

  created() {
    this.set_code = this.preferences.set_code;
    this.cardpool = this.cardpool;
    this.pick_timer = this.preferences.pick_timer;
    this.pick_ratings = this.preferences.pick_ratings;
    this.applySetPreferences();
  },

  components: {
    ContentPanel, SetSelect, CardpoolSelect
  },

  computed: {
    ...mapState([
      'preferences'
    ])
  },

  methods: {
    
    ...mapMutations({
      updatePreferences: UPDATE_PREFERENCES
    }),

    ...mapActions({
      createDraft: CREATE_DRAFT
    }),

    onStartDraft: function() {

      // update prefs for future drafts
      this.updatePreferences({
        set_code: this.set_code,
        cardpool: this.cardpool,
        pick_timer: this.pick_timer,
        pick_ratings: this.pick_ratings
      });

      // create the draft then navigate to it
      this.createDraft({ 
        set_code: this.set_code, 
        cardpool: this.cardpool, 
        options: { 
          pick_timer: this.pick_timer, 
          pick_ratings: this.pick_ratings 
        }
      }).then(( {draft_id }) => {
        this.$router.push({ path: "/draft/" + draft_id });
      });   
    },

    applySetPreferences() {
      // apply set prefs if we have them
      let set_prefs = this.preferences.sets[this.set_code];
      if (set_prefs) {
        this.cardpool = set_prefs.cardpool || this.cardpool;
      }
    },

    onSetChanged() {
      this.applySetPreferences();
    },
  }

}

</script>

<template>

<ContentPanel caption="Start New Draft">
  <form>
    <SetSelect v-model="set_code" @input="onSetChanged" />
    <CardpoolSelect v-model="cardpool" :set_code="set_code"/>
    <div class="form-group row">
      <label for="draft-options" class="col-sm-3 col-form-label">Options:</label>
      <div id="draft-options" class="col-sm-8">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="draft-timer"  v-model="pick_timer">
          <label class="form-check-label" for="draft-timer">Apply pick time limit</label>
          <small class="form-text text-muted">
             You will have 1 minute and 15 seconds for the first pick in each pack, and 5 seconds
             less for each pick thereafter (these are the same time limits used by MTGO). 
             If time runs out then a pick is made automatically.
          </small>
        </div>
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="draft-analysis"  v-model="pick_ratings">
          <label class="form-check-label" for="draft-analysis">Provide card ratings</label>
          <small class="form-text text-muted">
             Optional display of ratings for cards in the current pack.
             Note that while card ratings provide a rough idea of the relative power level between cards, 
             they don't necessarily reflect optimal picks (as they don't consider draft signals,
             deck synergies, etc).
          </small>
        </div>
      </div>
    </div>
    <br/>
    <div class="form-group row">
      <div class="col-sm-10">
        <button type="button" class="btn btn-success" @click="onStartDraft">Start Draft</button>
      </div>
    </div>
  </form>
</ContentPanel>

</template>


<style>

</style>

