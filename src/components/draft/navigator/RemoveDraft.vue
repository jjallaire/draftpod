<script>

import { Events, EventBus } from '@/components/draft/eventbus'

import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"

export default {
  name: 'RemoveDraft',

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

  components: {
    DeleteIcon
  },

  methods: {
    onDraftRemove() {
      EventBus.$emit(Events.DraftRemove, {
        draft_id: this.draft_id,
        source: this.remove_source
      });
    }
  }
}
</script>

<template>

 <a class="mtgdrafter-remove-draft-button" 
    @click.stop="onDraftRemove">
    <DeleteIcon title="Remove draft"/>
  </a>

</template>

<style>

.mtgdrafter-remove-draft-button {
  cursor: pointer;
}

</style>
