

<template>

  <div class="mtgdraft-pack card bg-light">
    <div class="card-body">
      <Card v-for="card in pack(player)" :key="card.key" 
            :player="player" :card="card" :drag_source="drag_source">
      </Card>
      <span v-for="n in (16 - pack(player).length)" :key="n" 
            class="mtgcard mtgcard-empty" draggable="false">
      <img src="images/card-empty.png" />
      </span>
    </div>
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

.mtgdraft-pack .mtgcard img {
  width: 11.5%;
  height: auto;
  margin-bottom: 3px;
}

.mtgdraft-pack .mtgcard-empty img {
  user-select: none;
}

@media only screen and (max-width: 1000px) {
.mtgdraft-pack .mtgcard img,
.mtgdraft-pack .mtgcard-empty img {
  width: 10%;
} 
}

</style>

