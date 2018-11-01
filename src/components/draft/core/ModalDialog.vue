<template>

<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ caption }}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ cancel_caption }}</button>
        <button type="button" class="btn btn-primary">{{ ok_caption }}</button>
      </div>
    </div>
  </div>
</div>

</template>

<script>

export default {
  name: 'ModalDialog',

  props: {
    caption: {
      type: String,
      default: "MTG Drafter",
    },
    cancel_caption: {
      type: String,
      default: "Cancel"
    },
    ok_caption: {
      type: String,
      default: "OK"
    },
  },


}
</script>

<style>


</style>