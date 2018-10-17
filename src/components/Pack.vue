

<template>
  <div class="pack">
    <Card v-for="card in pack(player)" :key="card.key" :card="card" 
          :drag_source="drag_source">
    </Card>
    <span v-for="n in (15 - pack(player).length)" :key="n" 
          class="card card-empty" draggable="false">
     <img src="images/empty-card.png" />
    </span>
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
    ]),
  },
  components: {
    Card
  },
}
</script>

<style>
.pack {
  padding-top: 7px;
  padding-left: 7px;
  margin-bottom: 7px;
}
.pack .card img {
  width: 11.5%;
  height: auto;
}
@media only screen and (max-width: 1000px) {
.pack .card img {
  width: 10%;
} 
}

.pack .card-empty img {
  user-select: none;
}
</style>

