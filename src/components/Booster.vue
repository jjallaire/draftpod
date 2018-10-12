

<template>
  <div class="booster">
    <Card v-for="card in cards" :key="card.key" :card="card" 
          :drag_source="drag_source">
    </Card>
  </div>
</template>


<script>
import Card from './Card.vue';
import { DragSources } from './constants'

export default {
  name: 'Booster',
  data() {
    return {
      drag_source: DragSources.Booster
    }
  },
  props: {
    cards: Array
  },
  components: {
    Card
  },
}
</script>

<style>

</style>

