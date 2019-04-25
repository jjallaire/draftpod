<script>

import ClipboardIcon from "vue-material-design-icons/ClipboardOutline.vue"

import MultiplayerPlayers from '@/components/core/MultiplayerPlayers.vue'

import jquery from 'jquery'

import * as log from '@/core/log'

import * as utils from '@/components/core/utils'

export default {
  name: 'MultiplayerOptions',

  components: {
    ClipboardIcon, MultiplayerPlayers
  },

  props: {
    value: {
      type: Object,
      required: true 
    },
    players: {
      type: Array,
      required: true
    }
  },

  data: function() {
    return {
      inputVal: this.value
    }
  },

  computed: {
    join_url: function() {
      return window.location.origin + "/join/" + 
             this.inputVal.draft_id;
    },

  },


  mounted() {

    // setup copy tooltip
    jquery('#copy-join-url-to-clipboard').tooltip({
      title: 'URL copied!',
      trigger: 'manual'
    });
  },

  methods: {
    onNameChanged(event) {
      this.inputVal.player_name = event.target.value.trim();
      if (this.inputVal.player_name.length > 0)
        this.$emit('input', this.inputVal);
    },
   
    onCopyJoinUrl(event) {

      event.stopPropagation();
      event.preventDefault();

      // select the join url
      this.selectJoinUrl(true);

      try {

        // perform the copy
        document.execCommand('copy');

        // remove selection
        this.selectJoinUrl(false);
    
        // show success message
        this.onClipboardSuccess();

      } catch(error) {
        log.logException(error, "onCopyJoinURL");
      }
    },

    selectJoinUrl(select) {
      // get reference to the join url textarea
      let joinUrl = this.$refs["joinUrl"];
      utils.textareaCopySelection(joinUrl, select);
    },

    onClipboardSuccess() {
      let copy_url = jquery('#copy-join-url-to-clipboard');
      copy_url.tooltip('show');
      setTimeout(() => copy_url.tooltip('hide'), 1500);
    },
  },
  
}

</script>


<template>
  <div class="multiplayer-options">
    <div class="form-group">
      <label for="multiplayer-draft-name">
        Host player:
      </label>
      <input 
        id="multiplayer-draft-name" 
        ref="name" 
        :value="inputVal.player_name" 
        class="form-control" 
        placeholder="Enter your name" 
        @input="onNameChanged" 
        @keyup.enter.prevent="onNameChanged"
      >
    </div>

    <MultiplayerPlayers :players="players" />

    <div class="form-group">
      <label for="multiplayer-join-url">
        Other players can join using this URL: 
        <a 
          id="copy-join-url-to-clipboard" 
          href="" 
          data-toggle="tooltip"
          data-placement="top" 
          @click="onCopyJoinUrl"
        >
          <ClipboardIcon title="Copy URL to clipboard" /> Copy
        </a>
      </label>
      <textarea 
        id="multiplayer-join-url" 
        ref="joinUrl" 
        :value="join_url" 
        readonly 
        class="join-url"
      />
    </div>

    <p>
      Click <strong>Start</strong> once the other players have all joined and you are ready to begin the draft.
    </p>
  </div>
</template>


<style>

.multiplayer-options p,
.multiplayer-options .form-group {
  margin-bottom: 0.5rem;
}

#multiplayer-draft-name {
  background-color: rgb(236,236,236);
}

#multiplayer-draft-players {
  border-radius: 0.25rem;
  height: 150px;
  background-color: rgb(236,236,236);
  padding: 5px;
}

.join-url {
  width: 100%;
}

#copy-join-url-to-clipboard {
  cursor: pointer;
  margin-left: 8px;

}

#copy-join-url-to-clipboard {
  color: #d9d9d9;
}

#copy-join-url-to-clipboard:hover {
  color: #eee;
  text-decoration: none;
}


</style>

