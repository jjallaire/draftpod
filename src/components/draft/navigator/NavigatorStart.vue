<script>

import ContentPanel from '@/components/core/ContentPanel.vue'
import SelectSet from '@/components/draft/core/SelectSet.vue'
import SelectCardpool from '@/components/draft/core/SelectCardpool.vue'

// eslint-disable-next-line 
import { store } from '@/store'
import { UPDATE_PREFERENCES } from '@/store/mutations'
import { CREATE_DRAFT } from '@/store/actions'

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'NavigatorStart',

  data: function() {
    return {
      set_code: 'grn',
      cardpool: '4/3/2/1',
      pick_timer: true,
      pick_analysis: false
    }
  },

  created() {

    this.set_code = this.preferences.set_code;
    this.cardpool = this.cardpool;
    this.pick_timer = this.preferences.pick_timer;
    this.pick_analysis = this.preferences.pick_analysis;
    this.applySetPreferences();
  },

  components: {
    ContentPanel, SelectSet, SelectCardpool
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
        pick_analysis: this.pick_analysis
      });

      // create the draft then navigate to it
      this.createDraft({ 
        set_code: this.set_code, 
        cardpool: this.cardpool, 
        options: { 
          pick_timer: this.pick_timer, 
          pick_analysis: this.pick_analysis 
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
  <form class="start-draft">
    <SelectSet v-model="set_code" @input="onSetChanged" />
    <SelectCardpool v-model="cardpool" />
    <div class="form-group row">
      <label for="draft-options" class="col-sm-3 col-form-label">Draft options:</label>
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
        <!--
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="draft-analysis"  v-model="pick_analysis">
          <label class="form-check-label" for="draft-analysis">Provide pick analysis</label>
          <small class="form-text text-muted">
             When pick analysis is enabled, you can optionally view card ratings and 
             suggested picks based on the color composition of your deck. 
          </small>
        </div>
        -->
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

