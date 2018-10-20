

<template>
  <header class="mtgdraft-header">
    <div v-if="complete">Draft complete!</div> 
    <div v-else >Pack {{ current_pack }}, Pick {{ current_pick }}</div>
  </header>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Header',

  computed: {
    ...mapGetters([
      'current_pack',
      'current_pick',
      'complete'
    ]),
  },
}
</script>

<style>
.mtgdraft-header {
  width: 100%;
  font-size: 1.1em;
  font-weight: 500;
  background-color: #2780e3;
  border-color: #1967be;
  color: white;
  padding: 10px;

}
</style>
