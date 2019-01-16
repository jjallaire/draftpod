<script>

import NavBar from '../core/NavBar.vue'
import SiteFooter from '../core/SiteFooter.vue'

import IntroMd from './articles/intro.md'
import SinglePlayerMd from './articles/single-player.md'
import MultiPlayerMd from './articles/multi-player.md'
import DraftCubeMd from './articles/draft-cube.md'
import FAQMd from './articles/faq.md'
import FeedbackMd from './articles/feedback.md'

export default {
  name: 'GuidePage',

  components: {
    NavBar, SiteFooter, 
    IntroMd, SinglePlayerMd, MultiPlayerMd, DraftCubeMd, FAQMd, FeedbackMd
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
        <a class="nav-link active" id="intro-tab" data-toggle="pill" href="#intro" role="tab" aria-controls="intro" aria-selected="true">Introduction</a>
        <a class="nav-link" id="single-player-tab" data-toggle="pill" href="#single-player" role="tab" aria-controls="single-player" aria-selected="false">Single-Player Drafts</a>
        <a class="nav-link" id="multi-player-tab" data-toggle="pill" href="#multi-player" role="tab" aria-controls="multi-player" aria-selected="false">Multi-Player Drafts</a>
        <a class="nav-link" id="draft-cube-tab" data-toggle="pill" href="#draft-cube" role="tab" aria-controls="draft-cube" aria-selected="false">Creating a Draft Cube</a>
        <a class="nav-link" id="faq-tab" data-toggle="pill" href="#faq" role="tab" aria-controls="faq" aria-selected="false">Frequently Asked Questions</a>
        <a class="nav-link" id="feedback-tab" data-toggle="pill" href="#feedback" role="tab" aria-controls="feedback" aria-selected="false">Feedback &amp; Support</a>
      </div>
    </div>

    <div class="col-md-8">
      <div class="tab-content" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="intro" role="tabpanel" aria-labelledby="intro-tab">
          <IntroMd/>
        </div>
        
        <div class="tab-pane fade" id="single-player" role="tabpanel" aria-labelledby="single-player-tab">
          <SinglePlayerMd/>
        </div>
        
        <div class="tab-pane fade" id="multi-player" role="tabpanel" aria-labelledby="multi-player-tab">
          <MultiPlayerMd/>
        </div>

        <div class="tab-pane fade" id="draft-cube" role="tabpanel" aria-labelledby="draft-cube-tab">
          <DraftCubeMd/>
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
}

</style>



