
<template>

<div class="sidebar">
  <div class="sidebar-content">
    <img class="card-preview" v-if="card_preview" :src="card_preview.image"/>   
  </div>
</div> 

</template>
  

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Sidebar',

  computed: {
    ...mapGetters([
      'card_preview'
    ]),
  },
}
</script>


<style>
.sidebar {
  flex: 0 1 auto;
  background-color: yellow;
}

.sidebar-content {
  min-width: 230px;
  padding: 7px;
}

@media only screen and (max-width: 1200px) {
.sidebar-content {
  min-width: 180px;
}
}

@media only screen and (max-width: 1000px) {
.sidebar-content {
  min-width: 150px;
}
}


.card-preview {
  width: 100%;
  height: auto;
}


</style>


