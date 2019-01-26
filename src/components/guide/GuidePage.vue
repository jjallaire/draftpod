<script>

import NavBar from '../core/NavBar.vue'
import SiteFooter from '../core/SiteFooter.vue'

import WelcomeMd from './articles/welcome.md'
import SinglePlayerMd from './articles/single-player.md'
import MultiPlayerMd from './articles/multi-player.md'
import CardpoolsMd from './articles/cardpools.md'
import FAQMd from './articles/faq.md'
import Feedback from './articles/Feedback.vue'

import jquery from 'jquery'

export default {
  name: 'GuidePage',

  mounted() {
    this.manageTabHistory();
    this.manageExternalLinks();
  },

  methods: {
    manageTabHistory() {
      // page url normalized w/o trailing slash
      function pageUrl() {
        return location.href.replace(/\/$/, "");
      }

      // scroll to the top of the page (we do this on tab switch)
      function scrollToTop() {
        setTimeout(() => {
          jquery(window).scrollTop(0);
        }, 100);
      }

      // navigate to the tab indicated in the current hash
      function navigateToHash() {
        const url = pageUrl();
        let hash = url.split("#");
        if (hash.length < 2)
          hash = "welcome";
        else
          hash = hash[1];
        jquery('#v-pills-tab a[href="#'+hash+'"]').tab("show");
        scrollToTop();
      }

      // navigate when the hash changes (e.g. the back button)
      window.addEventListener("hashchange", navigateToHash); 

      // navigate immediately at startup if we have a hash
      if (location.hash) 
        navigateToHash();
      // otherwise navigate to the welcome page (will also trigger navigateToHash)
      else
        history.pushState(null, null, "/guide#welcome/");

      // interact w/ history and scroll top top when the tab is clicked  
      jquery('a[data-toggle="pill"]').on("click", function() {
        const url = pageUrl();
        const hash = jquery(this).attr("href");
        let newUrl = url.split("#")[0] + hash + "/";
        history.pushState(null, null, newUrl);
        scrollToTop();
      });
    },

    manageExternalLinks() {
      jquery(".guide-page a[href^='http']").attr("target","_blank");
    }
  },

  components: {
    NavBar, SiteFooter, 
    WelcomeMd, SinglePlayerMd, MultiPlayerMd, CardpoolsMd, FAQMd, Feedback
  }
}


</script>

<template>
 
  <div class="guide-page">
    
  <NavBar />

  <div class="container">

  <div class="row">
    <div class="col-md-3">
      <div class="nav flex-column nav-pills sticky-top" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active" id="welcome-tab" data-toggle="pill" href="#welcome" role="tab" aria-controls="welcome" aria-selected="true">Welcome</a>
        <a class="nav-link" id="single-player-tab" data-toggle="pill" href="#single-player" role="tab" aria-controls="single-player" aria-selected="false">Single-Player Drafts</a>
        <a class="nav-link" id="multi-player-tab" data-toggle="pill" href="#multi-player" role="tab" aria-controls="multi-player" aria-selected="false">Multi-Player Drafts</a>
        <a class="nav-link" id="cardpools-tab" data-toggle="pill" href="#cardpools" role="tab" aria-controls="multi-player" aria-selected="false">Draft Cardpools</a>
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

          
        <div class="tab-pane fade" id="cardpools" role="tabpanel" aria-labelledby="cardpools-tab">
          <CardpoolsMd/>
        </div>


        <div class="tab-pane fade" id="faq" role="tabpanel" aria-labelledby="faq-tab">
          <FAQMd/>
        </div>
        


        <div class="tab-pane fade" id="feedback" role="tabpanel" aria-labelledby="feedback-tab">
          <Feedback/> 
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

.guide-page h4,
.guide-page h5 {
  margin-top: 20px;
}

#faq h4 {
  margin-top: 20px;
}

.guide-page .sticky-top {
  top: 70px;
}

.guide-page .nav-pills {
  padding-bottom: 30px;
}

.guide-page .nav-pills .nav-link {
  padding-top: 20px;
  padding-bottom: 20px;
  border: none;
  border-radius: 0;
  color: rgba(255,255,255,0.7);
}

.guide-page .tab-content {
  padding-left: 10px;
}


</style>



