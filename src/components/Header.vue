

<template>
  <header class="header">
    <div v-if="complete">Draft complete!</div> 
    <div v-else >Pack {{ current_pack }}&nbsp;Pick {{ current_pick }}</div>
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
.header {
  width: 100%;
  background-color: #2780e3;
  border-color: #1967be;
  color: white;
  padding: 10px;

}
</style>
