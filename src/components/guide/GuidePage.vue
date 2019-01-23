<script>

/*
Docs todo:
   - Article on set cubes
   - Navigation to set-cubes from multi-player / history
   - Use web contact form for Feedback and Support
*/

import NavBar from '../core/NavBar.vue'
import SiteFooter from '../core/SiteFooter.vue'

import WelcomeMd from './articles/welcome.md'
import SinglePlayerMd from './articles/single-player.md'
import MultiPlayerMd from './articles/multi-player.md'
import SetCubesMd from './articles/set-cubes.md'
import FAQMd from './articles/faq.md'
import FeedbackMd from './articles/feedback.md'

import jquery from 'jquery'

export default {
  name: 'GuidePage',

  mounted() {
    
    function navigateToHash() {
      let url = location.href.replace(/\/$/, "");
      const hash = url.split("#");
      if (hash.length === 1)
        hash.push("welcome");
      jquery('#v-pills-tab a[href="#'+hash[1]+'"]').tab("show");
      url = location.href.replace(/\/#/, "#");
      setTimeout(() => {
        jquery(window).scrollTop(0);
      }, 400);
    }

    if (location.hash) 
      navigateToHash();
    else
      history.pushState(null, null, "/guide#welcome/");

    window.addEventListener("hashchange", navigateToHash); 
    
    jquery('a[data-toggle="pill"]').on("click", function() {
      let url = location.href.replace(/\/$/, "");
      let newUrl;
      const hash = jquery(this).attr("href");
      newUrl = url.split("#")[0] + hash;
      newUrl += "/";
      history.pushState(null, null, newUrl);
    });
  },

  components: {
    NavBar, SiteFooter, 
    WelcomeMd, SinglePlayerMd, MultiPlayerMd, SetCubesMd, FAQMd, FeedbackMd
  }
}


</script>

<template>
 
  <div class="guide-page">
    
  <NavBar />

  <div class="container">

  <h1>Using draftpod</h1>

  <hr/>

  <div class="row">
    <div class="col-md-3">
      <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active" id="welcome-tab" data-toggle="pill" href="#welcome" role="tab" aria-controls="welcome" aria-selected="true">Welcome</a>
        <a class="nav-link" id="single-player-tab" data-toggle="pill" href="#single-player" role="tab" aria-controls="single-player" aria-selected="false">Single-Player Drafts</a>
        <a class="nav-link" id="multi-player-tab" data-toggle="pill" href="#multi-player" role="tab" aria-controls="multi-player" aria-selected="false">Multi-Player Drafts</a>
        <a class="nav-link" id="set-cubes-tab" data-toggle="pill" href="#set-cubes" role="tab" aria-controls="multi-player" aria-selected="false">Creating a Set Cube</a>
        <a class="nav-link" id="faq-tab" data-toggle="pill" href="#faq" role="tab" aria-controls="faq" aria-selected="false">Frequently Asked Questions</a>
        <a class="nav-link" id="feedback-tab" data-toggle="pill" href="#feedback" role="tab" aria-controls="feedback" aria-selected="false">Feedback &amp; Support</a>
      </div>
    </div>

    <div class="col-md-8">
      <div class="tab-content" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="welcome" role="tabpanel" aria-labelledby="welcome-tab">
          <WelcomeMd/>
        </div>
        
        <div class="tab-pane fade" id="single-player" role="tabpanel" aria-labelledby="single-player-tab">
          <SinglePlayerMd/>
        </div>
        
        <div class="tab-pane fade" id="multi-player" role="tabpanel" aria-labelledby="multi-player-tab">
          <MultiPlayerMd/>
        </div>

          
        <div class="tab-pane fade" id="set-cubes" role="tabpanel" aria-labelledby="set-cubes-tab">
          <SetCubesMd/>
        </div>


        <div class="tab-pane fade" id="faq" role="tabpanel" aria-labelledby="faq-tab">
          <FAQMd/>
        </div>
        
        <div class="tab-pane fade" id="feedback" role="tabpanel" aria-labelledby="feedback-tab">
          <FeedbackMd/>
        </div>
      </div>
    </div>
  </div>

  <SiteFooter />

  </div>

  </div>
  


</template>


<style>

.guide-page a {
  color: #d9d9d9;
}

.guide-page h2 {
  margin-bottom: 20px;
}

.guide-page h5 {
  margin-top: 20px;
}

.guide-page .nav-pills .nav-link {
  padding-top: 20px;
  padding-bottom: 20px;
  border: none;
  border-radius: 0;
  color: rgba(255,255,255,0.7);
}

</style>



