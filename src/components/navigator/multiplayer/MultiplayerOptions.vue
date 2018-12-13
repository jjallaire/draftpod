

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
    }
  },

  data: function() {
    return {
      inputVal: this.value
    }
  },

  computed: {
    join_url: function() {
      return window.location.origin + this.$route.fullPath + 
             this.inputVal.draft_id + "/join"
    }
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

  <br/>
  <p>Provide this URL to other players that wish to join the draft: </p>
  
  <span class="join-url">{{ join_url }} </span>

  <a id="copy-join-url-to-clipboard"
     v-clipboard="join_url"
     v-clipboard:success="onClipboardSuccess"
     data-toggle="tooltip" data-placement="top">
    <ClipboardIcon title="Copy URL to clipboard"/>
  </a>

  </div>
</div>

</template>


<style>

.join-url {
  color:#e9ecef ;
}

#copy-join-url-to-clipboard {
  cursor: pointer;
  margin-left: 8px;
}

#copy-join-url-to-clipboard:hover {
  color: #eee;
}


</style>

