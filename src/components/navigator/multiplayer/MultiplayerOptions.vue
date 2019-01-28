<script>

import ClipboardIcon from "vue-material-design-icons/ClipboardOutline.vue"

import MultiplayerPlayers from '@/components/core/MultiplayerPlayers.vue'

import jquery from 'jquery'

import * as log from '@/core/log'

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
      
      // on iOS we need to do a special dance to make it selectable
      let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
      if (isiOSDevice) {

        let editable = joinUrl.contentEditable;

        joinUrl.contentEditable = true;

        var selection = window.getSelection();
        selection.removeAllRanges();

        if (select) {
          let range = document.createRange();
          range.selectNodeContents(joinUrl);
          selection.addRange(range);
          joinUrl.setSelectionRange(0, 999999);
        } else {
          joinUrl.setSelectionRange(0,0);
        }

        joinUrl.contentEditable = editable;

      // in most environments we can just call select()
      } else {
        if (select)
          joinUrl.select();
        else
          window.getSelection().removeAllRanges();
      }

      // blur
      joinUrl.blur();
    },

    onClipboardSuccess() {
      let copy_url = jquery('#copy-join-url-to-clipboard');
      copy_url.tooltip('show');
      setTimeout(() => copy_url.tooltip('hide'), 1500);
    },
  },

  components: {
    ClipboardIcon, MultiplayerPlayers
  }
  
}

</script>


<template>

<div>

  <div class="form-group">
    <label for="multiplayer-draft-name">Host player:</label>
    <input class="form-control" id="multiplayer-draft-name" placeholder="Enter your name" 
          :value="inputVal.player_name" @input="onNameChanged" v-on:keyup.enter.prevent="onNameChanged" ref="name"/>
  </div>

  <MultiplayerPlayers :players="players" />

  <div class="form-group">
    <label for="multiplayer-join-url">
      Other players can join using this URL: 
      <a @click="onCopyJoinUrl" href="" id="copy-join-url-to-clipboard"
         data-toggle="tooltip" data-placement="top">
         <ClipboardIcon title="Copy URL to clipboard"/> Copy
      </a>
    </label>
    <textarea id="multiplayer-join-url" readonly ref="joinUrl" :value="join_url" class="join-url" />
  </div>

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

