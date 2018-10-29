

<template>
<nav class="navbar navbar-dark bg-primary navbar-expand-sm">

  <span class="navbar-brand">MTG Drafter</span>
  
   
  <span class="navbar-text">Guilds of Ravnica &mdash; 
    <span v-if="picks_complete">Picks Completed</span>
    <span v-else>Pack {{ current_pack }}, Pick {{ current_pick }}</span>
  </span> 
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link">
        <ExitToAppIcon title="Exit Draft"/>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link">
        <FullScreenIcon title="Fullscreen" @click.native="fullscreenToggle"/>
      </a>
    </li>
  </ul> 

  <ul class="navbar-nav ml-auto">
    <li class="nav-item">
      <a class="nav-link" href="#">Home</a>
    </li>
    <li class="nav-item active">
      <a class="nav-link" href="#">Draft</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">About</a>
    </li>
  </ul>
  
</nav>
</template>

<script>

import { mapGetters } from 'vuex';

import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"

export default {
  name: 'Navbar',

  computed: {
    ...mapGetters([
      'current_pack',
      'current_pick',
      'picks_complete'
    ]),
  },

  components: {
    FullScreenIcon, ExitToAppIcon
  },

  methods: {
    fullscreenToggle: function() {
      document.documentElement.webkitRequestFullScreen();
    }
  }
}
</script>

<style>
.navbar {
  padding: 8px;
  border: 0;
}

.navbar .navbar-brand {
  font-size: 1rem;
  font-weight: 400;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0.3rem;
}

.navbar .navbar-text {
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 1em;
}

.navbar .nav-link {
  padding: 0;
}

.navbar .nav-item .material-design-icon {
  font-size: 1.3rem;
  line-height: inherit;
}
</style>
