

<template>

<div>
  <h2>New Draft</h2>
  <br/>
  <form>
    <div class="form-group row">
      <label for="draft-set" class="col-sm-3 col-form-label">Draft Set:</label>
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
        <input type="checkbox" class="form-check-input" id="draft-timer">
        <label class="form-check-label" for="draft-timer">Apply time limit to picks</label>
      </div>
    </div>
    <br/>
    <button type="button" class="btn btn-success" @click="onStartDraft">Begin Draft</button>

  </form>
</div>


</template>


<script>

import { mapActions } from 'vuex'

import { START_DRAFT } from '../../../store/actions';

export default {
  name: 'Start',
  props: {
    player: {
      type: Number,
      required: true
    }
  },

  data: function() {
    return {
      set: 'grn'
    }
  },

  methods: {
    ...mapActions({
      startDraft: START_DRAFT,
    }),
    onStartDraft: function() {
      this.startDraft({ playerNumber: this.player, set_code: this.set });
    },
  }

}

</script>


<style>

#draft-options {
  padding-left: 35px;
  padding-top: 13px;
}

</style>
