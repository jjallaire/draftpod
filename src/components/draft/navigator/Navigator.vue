

<template>
<div class="container">

<div id="navigator-accordion">

  <NavigatorPanel name="resume-draft" caption="Resume Draft" parent="#navigator-accordion" :show="true">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry 
    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor 
    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, 
    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch
    et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat 
    craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't
    heard of them accusamus labore sustainable VHS.
  </NavigatorPanel>

  <NavigatorPanel name="new-draft" caption="Start New Draft" parent="#navigator-accordion">
    <form class="mtgdraft-start">
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
          <button type="button" class="btn btn-success" @click="onStartDraft">Begin Draft &#xbb;</button>
        </div>
      </div>
    </form>
  </NavigatorPanel>

  <NavigatorPanel name="previous-drafts" caption="Previous Drafts" parent="#navigator-accordion">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry 
    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor 
    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, 
    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch
    et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
    sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat 
    craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't
    heard of them accusamus labore sustainable VHS.
  </NavigatorPanel>

</div>



</div>

</template>


<script>

import { mapActions } from 'vuex'

import { START_DRAFT } from '../../../store/actions';

import NavigatorPanel from './NavigatorPanel.vue'

export default {
  name: 'Navigator',
  props: {
    player: {
      type: Number,
      required: true
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
    NavigatorPanel
  },

  methods: {
    ...mapActions({
      startDraft: START_DRAFT,
    }),
    onStartDraft: function() {
      this.startDraft({ 
        playerNumber: this.player, 
        set_code: this.set,
        pick_timer: this.pick_timer,
        pick_analysis: this.pick_analysis,
      });
    },
  }

}

</script>


<style>

.mtgdraft-start {
  border: 0;
}

.mtgdraft-start .btn {
  padding-left: 25px;
  padding-right: 25px;
  border: 0;
}

.mtgdraft-start .form-check {
  margin-top: 10px;
}

</style>
