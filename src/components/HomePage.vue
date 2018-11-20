<script>

import NavigationBar from './core/NavigationBar.vue'

export default {
  name: 'HomePage',

  components: {
    NavigationBar
  }
}

</script>

<template>
 
  <div>
    
  <NavigationBar />
    
  <div class="container">

  <div class="jumbotron text-muted">
    <h1 class="display-3">Hello, world!</h1>
    <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <hr class="my-4">
    <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
    <p class="lead">
      <a class="btn btn-success btn-lg" href="#" role="button">Learn more</a>
    </p>
  </div>

  </div>
    
  </div>

</template>

<style>

.jumbotron {
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
}

.jumbotron .btn {
  border: none;
}

</style>


