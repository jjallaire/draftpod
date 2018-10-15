

<template>
  <div class="pack">
    <div>Pack: {{ current_pack }}&nbsp;Pick: {{ current_pick }}</div>
    <Card v-for="card in pack(player)" :key="card.key" :card="card" 
          :drag_source="drag_source">
    </Card>
  </div>
</template>

<script>
import Card from './Card.vue';
import { mapGetters } from 'vuex';
import { DRAG_SOURCE_PACK } from './constants'

export default {
  name: 'Pack',
  props: {
    player: {
      type: Number,
      required: true
    }
  },
  computed: {
    drag_source: () => DRAG_SOURCE_PACK,
    ...mapGetters([
      'pack',
      'current_pack',
      'current_pick'
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

