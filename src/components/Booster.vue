

<template>
  <div class="booster">
    <Drag tag="span" v-for="card in cards" :transfer-data="card" :key="card.key">
      <Card :card="card"></Card>
    </Drag>
  </div>
</template>

<script>
import Card from './Card.vue';
import { Drag } from 'vue-drag-drop';

export default {
  name: 'Booster',
  props: {
    cards: Array
  },
  components: {
    Card, Drag
  },
}

</script>

<style>

</style>

