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

  <h1>Guide to using draftpod</h1>

  <hr/>

  <div class="row">
    <div class="col-md-3">
      <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active" id="v-pills-intro-tab" data-toggle="pill" href="#v-pills-intro" role="tab" aria-controls="v-pills-intro" aria-selected="true">Introduction</a>
        <a class="nav-link" id="v-pills-single-player-tab" data-toggle="pill" href="#v-pills-single-player" role="tab" aria-controls="v-pills-single-player" aria-selected="false">Single-Player Drafts</a>
        <a class="nav-link" id="v-pills-multi-player-tab" data-toggle="pill" href="#v-pills-multi-player" role="tab" aria-controls="v-pills-multi-player" aria-selected="false">Multi-Player Drafts</a>
        <a class="nav-link" id="v-pills-draft-cube-tab" data-toggle="pill" href="#v-pills-draft-cube" role="tab" aria-controls="v-pills-draft-cube" aria-selected="false">Creating a Draft Cube</a>
        <a class="nav-link" id="v-pills-faq-tab" data-toggle="pill" href="#v-pills-faq" role="tab" aria-controls="v-pills-faq" aria-selected="false">Frequently Asked Questions</a>
        <a class="nav-link" id="v-pills-feedback-tab" data-toggle="pill" href="#v-pills-feedback" role="tab" aria-controls="v-pills-feedback" aria-selected="false">Feedback &amp; Support</a>
      </div>
    </div>

    <div class="col-md-8">
      <div class="tab-content" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-pills-intro" role="tabpanel" aria-labelledby="v-pills-intro-tab">
          <IntroMd/>
        </div>
        
        <div class="tab-pane fade" id="v-pills-single-player" role="tabpanel" aria-labelledby="v-pills-single-player-tab">
          <SinglePlayerMd/>
        </div>
        
        <div class="tab-pane fade" id="v-pills-multi-player" role="tabpanel" aria-labelledby="v-pills-multi-player-tab">
          <MultiPlayerMd/>
        </div>

        <div class="tab-pane fade" id="v-pills-draft-cube" role="tabpanel" aria-labelledby="v-pills-draft-cube-tab">
          <DraftCubeMd/>
        </div>


        <div class="tab-pane fade" id="v-pills-faq" role="tabpanel" aria-labelledby="v-pills-faq-tab">
          <FAQMd/>
        </div>
        
        <div class="tab-pane fade" id="v-pills-feedback" role="tabpanel" aria-labelledby="v-pills-feedback-tab">
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

.guide-page .nav-pills .nav-link {
  padding-top: 20px;
  padding-bottom: 20px;
  border: none;
  border-radius: 0;
}

</style>



