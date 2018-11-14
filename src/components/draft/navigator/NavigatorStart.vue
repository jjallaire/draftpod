



<template>

<NavigatorPanel name="new-draft" caption="Start New Draft" :parent="parent" :show="show">
  <template slot="icon"><PlayCircleIcon/></template>
  <form class="mtgdraft-navigator-start-draft">
    <div class="form-group row">
      <label for="draft-set" class="col-sm-3 col-form-label">Set:</label>
      <div class="col-sm-9">
        <select id="draft-set" class="form-control" v-model="set">
          <option value="grn">Guilds of Ravnica</option>
          <option value="m19">Core Set 2019</option>
          <option value="dom">Dominaria</option>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <label for="draft-cardpool" class="col-sm-3 col-form-label">Cardpool:</label>
      <div class="col-sm-9">
        <select id="draft-cardpool" class="form-control">
          <option>All Cards</option>
          <option>4x Commons/Uncommons</option>
          <option>Custom...</option>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <label for="draft-options" class="col-sm-3 col-form-label">Options:</label>
      <div id="draft-options" class="col-sm-9">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="draft-timer"  v-model="pick_timer">
          <label class="form-check-label" for="draft-timer">Apply pick time limit</label>
        </div>
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="draft-analysis"  v-model="pick_analysis">
          <label class="form-check-label" for="draft-analysis">Provide pick analysis</label>
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
</NavigatorPanel>

</template>

<script>

import NavigatorPanel from './NavigatorPanel.vue'
import PlayCircleIcon from "vue-material-design-icons/PlayCircleOutline.vue"

import { useDraftModule } from '@/store'
import { START_DRAFT } from '@/store/modules/draft/actions';

import uuidv4 from 'uuid'

export default {
  name: 'NavigatorStart',

  props: {
    parent: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      set: 'grn',
      pick_timer: true,
      pick_analysis: true
    }
  },

  components: {
    NavigatorPanel, PlayCircleIcon
  },

  methods: {
    onStartDraft: function() {
      
      // generate new draft_id
      let draft_id = uuidv4();

      // use draft module
      useDraftModule(draft_id);

      // start the draft
      this.$store.dispatch("drafts/" + draft_id + "/" + START_DRAFT, { 

        set_code: this.set,
        pick_timer: this.pick_timer,
        pick_analysis: this.pick_analysis,
      
      }).then(() => {

        // push state
        this.$router.push("/draft/" + draft_id);

      });

     
    },
  }

}

</script>

<style>

</style>

