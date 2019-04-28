<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'

import config from '@/config'

export default {
  name: 'HomePage',

  components: {
    NavBar, SiteFooter
  },

  data: function() {
    return {
      site: config.site
    }
  }
}

</script>

<template>
  <div>
    <NavBar />
    
    <main class="home-content" role="main">

      <div class="jumbotron">
        
        <div class="container">
          
          <div class="row">
            <div class="col-sm-6">
              <h1 class="display-3">{{ site.title }}</h1>
              <h3>Multi-player draft and sealed simulator for MTG</h3>
              
              <router-link 
                class="draftpod-play-btn btn btn-success" 
                role="button" 
                to="/play/?format=draft"
              >
                Play Draft
              </router-link>

              <router-link 
                class="draftpod-play-btn btn btn-warning" 
                role="button" 
                to="/play/?format=sealed"
              >
                Play Sealed
              </router-link> 
            </div>
            <div class="col-sm-6">
              <img 
                class="draftpod-screenshot" 
                width="100%"
                src="/images/screenshot.png"
              >
            </div>
          </div>

          <div class="row">

            <hr>

            <p class="lead">
              Limited is a great way to play Magic&mdash;everyone starts with the same resources and you get a fresh deck building challenge every time. 
              So why not play limited all the time? With {{ site.title }}, now you can.
            </p>
          </div>
        </div>
          
      </div>

      
      <div class="container draftpod-features">
    
        <div class="row">
          <div class="col-md-4">
            <h2>MTG Arena</h2>
            <p>
              Want to play draft and sealed
              with your friends on Arena? If your set collection is relatively complete, you can draft or build sealed decks on {{ site.title }}, then play using 
              <a href="https://mtgarena-support.wizards.com/hc/en-us/articles/360001447063-Direct-Challenge-FAQ" target="_blank">Arena Direct Challenge</a>. 
            </p>
            <router-link 
              class="draftpod-learn-more btn btn-secondary" 
              role="button" 
              to="/guide#arena/"
            >
              Learn More &raquo;
            </router-link> 
          </div>
          <div class="col-md-4">
            <h2>Paper Magic</h2>
            <p>Get more replay value out of your paper collection by using it to play draft and sealed
              with only or 2 or 3 players. Your set cube is digitially shuffled into a brand new set of packs every time you play. </p>
            <router-link 
              class="draftpod-learn-more btn btn-secondary" 
              role="button" 
              to="/guide#multi-player/"
            >
              Learn More &raquo;
            </router-link> 
          </div>
          <div class="col-md-4">
            <h2>Solo Mode</h2>
            <p>Don't have anyone to play with right now but still want to brush up on your limited skills?
              Use the single-player simulator to practice evaluating cards, reading signals, and building decks.</p>
            <router-link 
              class="draftpod-learn-more btn btn-secondary" 
              role="button" 
              to="/guide#single-player/"
            >
              Learn More &raquo;
            </router-link> 
          </div>
        </div>
      </div>
    </main>

    <div class="container">
      <SiteFooter />
    </div>
  </div>
</template>

<style>

.home-content .draftpod-features a {
  color: #d9d9d9;
}

.home-content .jumbotron {
  padding-top: 1rem;
  padding-bottom: 2.0rem;
  border: none;
}

.home-content .jumbotron .display-3 {
  font-weight: 500;
  font-size: 4rem;
}

.home-content .jumbotron h3 {
  font-size: 1.2rem;
}

.home-content .lead {
  font-weight: 400;
  padding-left: 15px;
  padding-right: 15px;
}

.home-content .draftpod-screenshot {
  margin-right: 45px;
}

.home-content .draftpod-features {
  margin-top: 40px;
}

.home-content .draftpod-features li {
  margin-bottom: 15px;
}

.home-content .draftpod-play-btn {
  min-width: 130px;
  margin-top: 30px;
  margin-right: 30px;
}


.home-content .draftpod-learn-more {
  margin-right: 20px;
  margin-bottom: 20px;
}



.home-content .draftpod-start-draft svg {
  margin-bottom: 3px;
}


.home-content .draftpod-intro {
  margin-bottom: 35px;
}


</style>


