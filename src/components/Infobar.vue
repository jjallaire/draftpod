
<template>

<div class="mtgdraft-infobar">
  <div class="mtgdraft-infobar-content">
     <img v-if="preview_image" class="mtgcard-preview" :src="preview_image"/> 
  </div>
</div> 

</template>
  

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Infobar',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'card_preview'
    ]),
    preview_image: function() {
      let card = this.card_preview(this.player);
      if (card)
        return card.image;
      else
        return null;
    }
  },
}
</script>


<style>
.mtgdraft-infobar {
  flex: 0 1 auto;
  background-color: rgba(39, 128, 227, 0.1);
}

.mtgdraft-infobar-content {
  width: 230px;
  padding: 10px;
}

@media only screen and (max-width: 1200px) {
.mtgdraft-infobar-content {
  width: 180px;
}
}

@media only screen and (max-width: 1000px) {
.mtgdraft-infobar-content {
  width: 150px;
}
}


.mtgcard-preview {
  width: 100%;
  height: auto;
}


</style>


