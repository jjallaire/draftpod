<template>

<div class="mtgdraft-cardview">
  <img :src="preview_image" />
</div>

</template>


<script>

import { mapGetters } from 'vuex';

export default {
  name: 'PreviewImage',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'card_preview',
    ]),
    preview_image: function() {
      let card = this.card_preview(this.player);
      if (card)
        return card.image;
      else
        return "images/card-back.png";
    },
  }
}

</script>


<style>

.mtgdraft-cardview {
  width: 100%;  
  margin-bottom: 6px;
}

.mtgdraft-cardview img {
  width: 100%;
  height: auto;
}

</style>