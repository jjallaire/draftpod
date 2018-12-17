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
    <h1 class="display-3">draftpod</h1>
    <h5>Draft simulator for Magic the Gathering<sup class="trademark">&trade;</sup></h5>

    <hr/>

    <p class="draftpod-intro lead">
      Love drafting but wish you could practice more? 
      Want to draft in a full 8-player pod but only have 2 or 3 players? 
      If so, draftpod is for you!
    </p>

    <img class="img-fluid draftpod-screenshot" align="left" src="/images/screenshot.png" />

    <p class="lead">
      <ul class="draftpod-features">
        <li>Practice evaluating cards, reading signals, and building decks in single-player mode.</li>
        <li>Simulate a full 8-person draft table even when you have only 2 or 3 players in 
            multi-player mode.
        </li>
      </ul>

      <a class="draftpod-start-draft btn btn-success btn-lg" href="#" role="button">Start a Draft &#8250;</a>
    </p>

    <p class="lead">
    </p>

  </div>

  </div>

  <SiteFooter />

  </div>

  </div>

</template>

<style>

.home-content {
  min-height: 70vh;
}

.home-content .jumbotron {
  padding-top: 2rem;
}

.home-content .draftpod-screenshot {
  width: 60%;
  margin-right: 45px;
}

.home-content .draftpod-features li {
  margin-bottom: 15px;
}

.home-content .draftpod-start-draft {
  margin-top: 20px;
}

.home-content .draftpod-intro {
  margin-bottom: 35px;
}


</style>


