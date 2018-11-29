<script>

import NavigatorPanel from './NavigatorPanel.vue'
import PlayCircleIcon from "vue-material-design-icons/PlayCircleOutline.vue"

import { useDraftModule } from '@/store'
import { UPDATE_PREFERENCES } from '@/store/mutations'
import { START_DRAFT } from '@/store/modules/draft/actions'
import { mapState, mapMutations } from 'vuex'

import uuidv4 from 'uuid'

export default {
  name: 'NavigatorStart',

  data: function() {
    return {
      set_code: 'grn',
      pick_timer: true,
      pick_analysis: false
    }
  },

  created() {
    this.set_code = this.preferences.set_code;
    this.pick_timer = this.preferences.pick_timer;
    this.pick_analysis = this.preferences.pick_analysis;
  },

  components: {
    NavigatorPanel, PlayCircleIcon
  },

  computed: {
    ...mapState([
      'preferences'
    ])
  },

  methods: {
    onStartDraft: function() {
      
      // generate new draft_id
      let draft_id = uuidv4();

      // use draft module
      useDraftModule(draft_id);

      // establish options
      let options = {
        set_code: this.set_code,
        cardpool: null,
        pick_timer: this.pick_timer,
        pick_analysis: this.pick_analysis
      };

      // save as preferences for the next draft
      this.updatePreferences(options);

      // start the draft
      this.$store.dispatch("drafts/" + draft_id + "/" + START_DRAFT, options)
        .then(() => {
          // push state
          this.$router.push({ path: "/draft/", hash: "#" + draft_id });
        });
     
    },
    ...mapMutations({
      updatePreferences: UPDATE_PREFERENCES
    }),
  }

}

</script>

<template>

<NavigatorPanel name="new-draft" caption="Start New Draft">
  <template slot="icon"><PlayCircleIcon/></template>
  <form class="start-draft">
    <div class="form-group row">
      <label for="draft-set" class="col-sm-3 col-form-label">Draft from:</label>
      <div class="col-sm-8">
        <select id="draft-set" class="form-control" v-model="set_code">
          <option value="grn">Guilds of Ravnica</option>
          <option value="m19">Core Set 2019</option>
          <option value="dom">Dominaria</option>
        </select>
      </div>
    </div>
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
</NavigatorPanel>

</template>


<style>

</style>

