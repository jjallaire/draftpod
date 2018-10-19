
<template>

<div class="sidebar">
  <div class="sidebar-content">
     <img v-if="preview_image" class="card-preview" :src="preview_image"/> 
  </div>
</div> 

</template>
  

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Sidebar',

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
.sidebar {
  flex: 0 1 auto;
  background-color: rgba(39, 128, 227, 0.1);
}

.sidebar-content {
  width: 230px;
  padding: 10px;
}

@media only screen and (max-width: 1200px) {
.sidebar-content {
  width: 180px;
}
}

@media only screen and (max-width: 1000px) {
.sidebar-content {
  width: 150px;
}
}


.card-preview {
  width: 100%;
  height: auto;
}


</style>


