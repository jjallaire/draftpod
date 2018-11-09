<template>

<div class="mtgdraft-cardview">
  <img :src="preview_image" />
</div>

</template>


<script>

import { Events, EventBus } from '@/components/draft/eventbus.js'

export default {
  name: 'PreviewImage',

  data: function() {
    return {
      preview_image: "/images/card-back.png",
    }
  },

  created() {
    let vm = this;
    EventBus.$on(Events.ViewCard, card => vm.preview_image = card.image);
  },

  destroyed() {
    EventBus.$off(Events.ViewCard);
  }
}

</script>


<style>

.mtgdraft-cardview {
  width: 100%;  
  margin-bottom: 4px;
}

.mtgdraft-cardview img {
  width: 100%;
  height: auto;
}

</style>