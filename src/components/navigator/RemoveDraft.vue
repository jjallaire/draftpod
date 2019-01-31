<script>

import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"

export default {
  name: 'RemoveDraft',

  components: {
    DeleteIcon
  },

  props: {
    draft_id: {
      type: String,
      required: true
    },
    remove_source: {
      type: String,
      required: true
    }
  },

  inject: [
    'removeDraft'
  ],

  methods: {
    onDraftRemove() {
      this.removeDraft({
        draft_id: this.draft_id,
        source: this.remove_source
      });
    }
  }
}
</script>

<template>
  <a 
    class="remove-draft-button" 
    @click.stop="onDraftRemove"
  >
    <DeleteIcon title="Remove draft" />
  </a>
</template>

<style>

.remove-draft-button {
  cursor: pointer;
}

</style>
