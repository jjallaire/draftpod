

<template>
<nav class="navbar navbar-dark bg-primary navbar-expand-sm">

  <span class="navbar-brand">MTG Drafter</span>
  
  <span class="navbar-text" v-if="complete">Draft complete!</span> 
  <span class="navbar-text" v-else>Guilds of Ravnica &mdash; Pack {{ current_pack }}, Pick {{ current_pick }}</span> 
  <ul class="navbar-nav">
    <li class="nav-item">
          <a class="nav-link" title="Restart Draft" href="#"><i class="material-icons nav-icon">refresh</i></a>
        </li>
    <li class="nav-item">
      <a class="nav-link" href="#" title="Fullscreen"
          onclick="document.documentElement.webkitRequestFullScreen(); return false;">
          <i class="material-icons nav-icon">fullscreen</i>
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

export default {
  name: 'Navbar',

  computed: {
    ...mapGetters([
      'current_pack',
      'current_pick',
      'complete'
    ]),
  },
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

.navbar .nav-icon {
  font-size: 1.3rem;
  line-height: inherit;
}
</style>
