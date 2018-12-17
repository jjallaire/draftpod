

<script>

import Vue       from 'vue'
import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

import ClipboardIcon from "vue-material-design-icons/ClipboardOutline.vue"

import jquery from 'jquery'

export default {
  name: 'MultiplayerOptions',

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
      return window.location.origin + "/draft/" + 
             this.inputVal.draft_id + "/join";
    },

  },

  mounted() {
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
    onClipboardSuccess() {
      let copy_url = jquery('#copy-join-url-to-clipboard');
      copy_url.tooltip('show');
      setTimeout(() => copy_url.tooltip('hide'), 1500);
    }
  },

  components: {
    ClipboardIcon
  }
  
}

</script>


<template>

<div>

<div class="form-group">
  <label for="multiplayer-draft-name">Host player:</label>
  <input class="form-control" id="multiplayer-draft-name" placeholder="Enter your name" 
         :value="inputVal.player_name" @input="onNameChanged" ref="name"/>
</div>

<div class="form-group">
  <label for="multiplayer-draft-players">Other players:</label>
  <div id="multiplayer-draft-players" class="card-body bg-light">
    <span v-for="(player, index) in players" :key="index">
      {{  player }} <br/>
    </span>
  </div>
</div> 

  <p>Other players can join the draft using this URL:</p>
  
  <p>
    <span class="join-url">{{ join_url }} </span>
    <a id="copy-join-url-to-clipboard"
      v-clipboard="join_url"
      v-clipboard:success="onClipboardSuccess"
      data-toggle="tooltip" data-placement="top">
      <ClipboardIcon title="Copy URL to clipboard"/>
    </a>
  </p>

  <p>
    Click <strong>Start Draft</strong> once the other players have all joined and you are ready to begin the draft.
  </p>

  
</div>

</template>


<style>

#multiplayer-draft-name {
  background-color: rgb(236,236,236);
}

#multiplayer-draft-players {
  border-radius: 0.25rem;
  height: 120px;
  background-color: rgb(236,236,236);
  padding: 5px;
}

.join-url {
  color: rgb(236,236,236); 
}

#copy-join-url-to-clipboard {
  cursor: pointer;
  margin-left: 8px;

}

#copy-join-url-to-clipboard:hover {
  color: #eee;
}


</style>

