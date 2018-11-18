<script>

import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"

export default {
  name: 'RemoveDraft',

  props: {
    draft_id: {
      type: Number,
      required: true
    },
    on_draft_remove: {
      type: Function,
      required: true
    }
  },

  components: {
    DeleteIcon
  },
}
</script>

<template>

 <a class="mtgdrafter-remove-draft-button" 
    @click.stop="on_draft_remove(draft_id)">
    <DeleteIcon title="Remove draft"/>
  </a>

</template>

<style>

.mtgdrafter-remove-draft-button {
  cursor: pointer;
}

</style>
