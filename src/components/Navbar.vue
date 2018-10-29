<template>
<nav class="navbar navbar-dark bg-primary navbar-expand-sm">

  <span class="navbar-brand">MTG Drafter</span>
  
  <slot></slot>

  <ul class="navbar-nav ml-auto">
    <li class="nav-item">
      <a class="nav-link" href="/">Home</a>
    </li>
    <li class="nav-item active">
      <a class="nav-link" href="/draft">Draft</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/about">About</a>
    </li>
  </ul>
  
</nav>
</template>

<script>

export default {
  name: 'Navbar',
}
</script>

<style>

.navbar {
  border: 0;
  padding: 8px;
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

.navbar .nav-item .material-design-icon {
  font-size: 1.3rem;
  line-height: inherit;
}
</style>
