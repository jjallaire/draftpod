<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'

export default {
  name: 'HomePage',

  components: {
    NavBar, SiteFooter
  }
}

</script>

<template>
 
  <div>
    
    <NavBar />
    
    <div class="container">

      <div class="home-content">

        <div class="jumbotron text-muted">
          <h1 class="display-3">Draftpod</h1>
          <h5>Draft simulator for Magic the Gathering</h5>

          <hr>

          <img 
            class="img-fluid draftpod-screenshot" 
            align="left" 
            src="/images/screenshot.png" >

          <p class="lead">
            <ul class="draftpod-features">
              <li>Practice evaluating cards, reading signals, and building decks in single-player mode.</li>
              <li>Simulate a full 8-person draft even when you have only 2 or 3 players in 
              multi-player mode.
              </li>
            </ul>

            <router-link 
              class="draftpod-learn-more btn btn-warning" 
              role="button" 
              to="/guide/">
              Learn More
            </router-link> 
            <router-link 
              class="draftpod-start-draft btn btn-success" 
              role="button" 
              to="/draft/">
              Start a Draft
            </router-link>

          </p>

          <div style="clear: both; margin-bottom: 10px;"/>

          <p class="lead"/>

        </div>

      </div>

      <SiteFooter />

    </div>

  </div>

</template>

<style>

.home-content .jumbotron {
  padding-top: 2rem;
}

.home-content .lead {
  font-weight: 400;
}

.home-content .draftpod-screenshot {
  width: 50%;
  margin-right: 45px;
}

.home-content .draftpod-features li {
  margin-bottom: 15px;
}

.home-content .btn {
  margin-top: 20px;
  padding-left: 25px;
  padding-right: 25px;
}

.home-content .draftpod-learn-more {
  margin-right: 20px;
}



.home-content .draftpod-start-draft svg {
  margin-bottom: 3px;
}


.home-content .draftpod-intro {
  margin-bottom: 35px;
}


</style>


