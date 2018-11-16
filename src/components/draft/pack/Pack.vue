

<template>

  <Panel panel_class="mtgdraft-pack">
    <div>
      <Card v-for="card in pack" :key="card.key" 
            :card="card" :drag_source="drag_source">
      </Card>
      <span v-for="n in (16 - pack.length)" :key="n" 
            class="mtgcard mtgcard-empty" draggable="false">
        <img src="/images/card-empty.png" />
      </span>
    </div>
  </Panel>
  

</template>

<script>
import Card from '@/components/draft/core/Card.vue';
import Panel from '@/components/core/Panel.vue';

export default {
  name: 'Pack',
  props: {
    pack: {
      type: Array,
      required: true
    }
  },
  computed: {
    drag_source: () => "DRAG_SOURCE_PACK",
  },
  components: {
    Card, Panel
  },
}
</script>

<style>

.mtgdraft .mtgdraft-pack {
  background: transparent;
}

.mtgdraft .mtgdraft-pack .card {
  padding: 0;
}

.mtgdraft .mtgdraft-pack .card-body {
  padding: 0;
}

.mtgdraft-pack .mtgcard img,
.mtgdraft-pack .mtgcard-empty img {
  width: 11.5%;
  min-height: 16.05%;
  margin-bottom: 3px;
}

.mtgdraft-pack .mtgcard-empty img {
  margin-right: 4px;
}

.mtgdraft-pack .mtgcard-empty img {
  user-select: none;
}

.mtgdraft-pack .mtgdraft-pack-timer {
  margin-left: 20px;
}

@media only screen and (max-width: 1000px) {
.mtgdraft-pack .mtgcard img,
.mtgdraft-pack .mtgcard-empty img {
  width: 10%;
  min-height: 13.95%;
} 
}

</style>

