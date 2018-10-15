

<template>
  <div class="pack">
    <Card v-for="card in pack" :key="card.key" :card="card" 
          :drag_source="drag_source">
    </Card>
  </div>
</template>

<script>
import Card from './Card.vue';
import { mapState } from 'vuex';
import { DRAG_SOURCE_PACK } from './constants'

export default {
  name: 'Pack',
  props: {
    cards: Array
  },
  computed: {
    drag_source: () => DRAG_SOURCE_PACK,
    ...mapState([
      'pack',
    ]),
  },
  components: {
    Card
  },
}
</script>

<style>
.pack .card img {
  width: 11.5%;
  height: auto;
}
</style>

