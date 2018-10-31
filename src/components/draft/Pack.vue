

<template>

  <Panel panel_class="mtgdraft-pack" background="secondary">
    <Card v-for="card in draft(player).pack" :key="card.key" 
            :player="player" :card="card" :drag_source="drag_source">
    </Card>
    <span v-for="n in (16 - draft(player).pack.length)" :key="n" 
          class="mtgcard mtgcard-empty" draggable="false">
      <img src="images/card-empty.png" />
    </span>
  </Panel>
  
</template>

<script>
import Card from './core/Card.vue';
import Panel from './core/Panel.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Pack',
  props: {
    player: {
      type: Number,
      required: true
    }
  },
  computed: {
    drag_source: () => "DRAG_SOURCE_PACK",
    ...mapGetters([
      'draft',
    ]),
  },
  components: {
    Card, Panel
  },
}
</script>

<style>

.mtgdraft-pack .card {
  padding: 0;
}

.mtgdraft .mtgdraft-pack .card-body {
  padding: 0;
}

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

