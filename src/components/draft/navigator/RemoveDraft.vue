<script>

import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"

import * as messagebox from '@/components/core/messagebox.js'

import { mapMutations } from 'vuex'
import { REMOVE_DRAFTS } from '@/store/mutations'

export default {
  name: 'RemoveDraft',

  props: {
    draft_id: {
      type: Number,
      required: true
    }
  },

  components: {
    DeleteIcon
  },

  methods: {
    onDraftRemove() {
      messagebox.confirm(
        "<p>Remove draft from history?</p> ",
        () => {
          this.removeDrafts([this.draft_id]);
        })
    },
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS
    })
  }
}
</script>

<template>

 <a class="mtgdrafter-remove-draft-button" @click.stop="onDraftRemove"><DeleteIcon title="Remove draft"/></a>

</template>

<style>

.mtgdrafter-remove-draft-button {
  cursor: pointer;
}

</style>
