

<template>
  <div class="pack">
    <Card v-for="card in pack(player)" :key="card.key" 
          :player="player" :card="card" :drag_source="drag_source">
    </Card>
    <span v-for="n in (16 - pack(player).length)" :key="n" 
          class="card card-empty" draggable="false">
     <img src="images/card-empty.png" />
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

.pack .card-empty img {
  user-select: none;
  width: 11.5%;
  height: auto;
}

@media only screen and (max-width: 1000px) {
.pack .card img,
.pack .card-empty img {
  width: 10%;
} 
}

</style>

