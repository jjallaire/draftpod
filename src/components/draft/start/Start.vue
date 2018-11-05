

<template>

<div>
  <h3>Start New Draft</h3>

  <form>
    <div class="form-group row">
      <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
      </div>
    </div>
    <div class="form-group row">
      <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
      <div class="col-sm-10">
        <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
      </div>
    </div>

    <button type="button" class="btn" @click="onStartDraft">Start Draft</button>

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

  methods: {
    ...mapActions({
      startDraft: START_DRAFT,
    }),
    onStartDraft: function() {
      this.startDraft({ playerNumber: this.player, set_code: 'grn' });
    },
  }

}

</script>


<style>

</style>
