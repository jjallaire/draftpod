<script>

import NavBar from '../core/NavBar.vue'
import SiteFooter from '../core/SiteFooter.vue'

export default {
  name: 'GuidePage',

  components: {
    NavBar, SiteFooter
  }
}

</script>

<!---

https://codepen.io/moso/pen/vKGxMx

-->

<template>
 
  <div>
    
  <NavBar />

  <div class="container">

  <h1>Guide to using draftpod</h1>

  <hr/>

  <div class="row">
    <div class="col-md-3">
      <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active" id="v-pills-intro-tab" data-toggle="pill" href="#v-pills-intro" role="tab" aria-controls="v-pills-intro" aria-selected="true">Intro to draftpod</a>
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
          Intro. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit sapien a interdum egestas. Duis id odio eu libero tempor pellentesque. Nullam pharetra et eros non elementum. Curabitur nec congue enim. Mauris tristique interdum vestibulum. Vestibulum ipsum turpis, aliquet ut imperdiet non, facilisis vel quam. Etiam condimentum sem a erat volutpat tristique. Nulla luctus rutrum luctus. Donec sed ex sed neque venenatis imperdiet eget nec tellus. Suspendisse potenti. Vestibulum elementum nisl lacus, sed molestie nunc fringilla eget. Pellentesque at aliquet orci. Fusce hendrerit sapien vel justo suscipit euismod. Nulla efficitur quam eu semper fermentum. Praesent eu aliquam enim, eu tincidunt elit. In ullamcorper, odio sit amet bibendum pulvinar, sem sapien sollicitudin nibh, sit amet consequat massa erat in eros.
        </div>
        
        <div class="tab-pane fade" id="v-pills-single-player" role="tabpanel" aria-labelledby="v-pills-single-player-tab">
          Single Player. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit sapien a interdum egestas. Duis id odio eu libero tempor pellentesque. Nullam pharetra et eros non elementum. Curabitur nec congue enim. Mauris tristique interdum vestibulum. Vestibulum ipsum turpis, aliquet ut imperdiet non, facilisis vel quam. Etiam condimentum sem a erat volutpat tristique. Nulla luctus rutrum luctus. Donec sed ex sed neque venenatis imperdiet eget nec tellus. Suspendisse potenti. Vestibulum elementum nisl lacus, sed molestie nunc fringilla eget. Pellentesque at aliquet orci. Fusce hendrerit sapien vel justo suscipit euismod. Nulla efficitur quam eu semper fermentum. Praesent eu aliquam enim, eu tincidunt elit. In ullamcorper, odio sit amet bibendum pulvinar, sem sapien sollicitudin nibh, sit amet consequat massa erat in eros.
        </div>
        
        <div class="tab-pane fade" id="v-pills-multi-player" role="tabpanel" aria-labelledby="v-pills-multi-player-tab">
          Multi Player. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit sapien a interdum egestas. Duis id odio eu libero tempor pellentesque. Nullam pharetra et eros non elementum. Curabitur nec congue enim. Mauris tristique interdum vestibulum. Vestibulum ipsum turpis, aliquet ut imperdiet non, facilisis vel quam. Etiam condimentum sem a erat volutpat tristique. Nulla luctus rutrum luctus. Donec sed ex sed neque venenatis imperdiet eget nec tellus. Suspendisse potenti. Vestibulum elementum nisl lacus, sed molestie nunc fringilla eget. Pellentesque at aliquet orci. Fusce hendrerit sapien vel justo suscipit euismod. Nulla efficitur quam eu semper fermentum. Praesent eu aliquam enim, eu tincidunt elit. In ullamcorper, odio sit amet bibendum pulvinar, sem sapien sollicitudin nibh, sit amet consequat massa erat in eros.
        </div>

        <div class="tab-pane fade" id="v-pills-draft-cube" role="tabpanel" aria-labelledby="v-pills-draft-cube-tab">
          Cube. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit sapien a interdum egestas. Duis id odio eu libero tempor pellentesque. Nullam pharetra et eros non elementum. Curabitur nec congue enim. Mauris tristique interdum vestibulum. Vestibulum ipsum turpis, aliquet ut imperdiet non, facilisis vel quam. Etiam condimentum sem a erat volutpat tristique. Nulla luctus rutrum luctus. Donec sed ex sed neque venenatis imperdiet eget nec tellus. Suspendisse potenti. Vestibulum elementum nisl lacus, sed molestie nunc fringilla eget. Pellentesque at aliquet orci. Fusce hendrerit sapien vel justo suscipit euismod. Nulla efficitur quam eu semper fermentum. Praesent eu aliquam enim, eu tincidunt elit. In ullamcorper, odio sit amet bibendum pulvinar, sem sapien sollicitudin nibh, sit amet consequat massa erat in eros.
        </div>


        <div class="tab-pane fade" id="v-pills-faq" role="tabpanel" aria-labelledby="v-pills-faq-tab">
          FAQ. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit sapien a interdum egestas. Duis id odio eu libero tempor pellentesque. Nullam pharetra et eros non elementum. Curabitur nec congue enim. Mauris tristique interdum vestibulum. Vestibulum ipsum turpis, aliquet ut imperdiet non, facilisis vel quam. Etiam condimentum sem a erat volutpat tristique. Nulla luctus rutrum luctus. Donec sed ex sed neque venenatis imperdiet eget nec tellus. Suspendisse potenti. Vestibulum elementum nisl lacus, sed molestie nunc fringilla eget. Pellentesque at aliquet orci. Fusce hendrerit sapien vel justo suscipit euismod. Nulla efficitur quam eu semper fermentum. Praesent eu aliquam enim, eu tincidunt elit. In ullamcorper, odio sit amet bibendum pulvinar, sem sapien sollicitudin nibh, sit amet consequat massa erat in eros.
        </div>
        
        <div class="tab-pane fade" id="v-pills-feedback" role="tabpanel" aria-labelledby="v-pills-feedback-tab">
          Feedback. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit sapien a interdum egestas. Duis id odio eu libero tempor pellentesque. Nullam pharetra et eros non elementum. Curabitur nec congue enim. Mauris tristique interdum vestibulum. Vestibulum ipsum turpis, aliquet ut imperdiet non, facilisis vel quam. Etiam condimentum sem a erat volutpat tristique. Nulla luctus rutrum luctus. Donec sed ex sed neque venenatis imperdiet eget nec tellus. Suspendisse potenti. Vestibulum elementum nisl lacus, sed molestie nunc fringilla eget. Pellentesque at aliquet orci. Fusce hendrerit sapien vel justo suscipit euismod. Nulla efficitur quam eu semper fermentum. Praesent eu aliquam enim, eu tincidunt elit. In ullamcorper, odio sit amet bibendum pulvinar, sem sapien sollicitudin nibh, sit amet consequat massa erat in eros.
        </div>
      </div>
    </div>
  </div>

  <!--
  <h3>What is draftpod?</h3>

  <p>
    Draftpod is an MTG draft simulator. 
    Booter draft is one of the most enjoyable ways to play Magic, however drafts typically require 6-8 players. 
    A draft simulator allows you draft by yourself (for practice), or to conduct drafts with smaller groups of players, 
    in which case simulated players (draft bots) take the other seats at the table.
  </p>

  <p>
    We think that drafting is the best way to play Magic, and wanted to make it as easy as possible to both 
    practice and play in small groups. We've tried 2 or 3 player formats like Winston Draft
    but have found them unsatisfying, since they don't well approximate the experience of an 8-player draft. 
  </p>  

  <p>
    Our hope is that with draftpod any 2 Magic players that want to
    draft can do so without compromising on the depth of strategy and skill that makes drafting such
    a great gaming experience.
  </p>


  <h3>How do I organize a 2 or 3 player draft with draftpod?</h3>

  <p> 
    To conduct a multi-player draft, you first need to assemble a set of Magic cards to draft from (a "cardpool"). 
    There are a few requirements for the cardpool:
  </p>

    <ul>
    <li>The cards should be from one of draftpod's supported sets (Dominaria, M19, or Guilds of Ravnica).</li>
    <li>All of the cards in the pool should be from a single set (no mixing of sets within a single cardpool).</li>
    <li>You need at least 384 cards in the cardpool (8 players x 3 boosters x 15 cards/booster)</li>
    <li>Your cardpool will ideally have an even number of each common, uncommon, rare, and mythic rare in the set.
        For example, 4 of each common, 3 of each uncommon, and 1 of each rare and mythic. This isn't required,
        but you will have a more varied drafting experience with an even distribution of cards.</li>
    <li>That said, you can also simply buy a Booster Box of the set you want to draft and use that as your cardpool, or
        even just assemble whatever extra cards you have on hand from the set. It's always better to have a complete
        set of all the cards but certainly not required.</li>
    </ul>

  <p>
    Once you've assembled your cardpool, you should organize it by card collector number (cards in each Magic set are 
    numbered sequentially). This will make it easier to pull out the cards to build your deck after you've 
    completed the draft. 
  </p>

  <p>
    When creating a multi-player draft, you'll also need to tell draftpod which cards are in your pool. If 
    you've built a pool with an even number of the various rarities then there is likely an option that
    covers your pool (e.g. 4/4/1/1, 4/4/2/1, 3/3/1/1, etc.) so you won't need to manually enter a list of your cards.
  </p>
  
  <p>
    However, if you've built a custom cardpool (e.g. from a Booster Box) 
    then you should enter the cards in your pool into a <a href="http://www.deckedbuilder.com/">Decked Builder</a> collection. 
    Once you've done this you can export the collection to a CSV file and then upload it to draftpod when defining your cardpool.
  </p>

  <p>
    Once draftpod knows about your cardpool you are ready to draft. After the draft completes you can download a 
    decklist, pull those cards out of the cardpool, and play your games!
  </p>
  -->

  <SiteFooter />

  </div>

  </div>
  


</template>


<style>

</style>



