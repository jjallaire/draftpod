<script>

export default {
  name: 'PlayerArrow',

  props: {
    corner: {
      type: String,
      required: true
    }
  },

  computed: {
    arrowStyle: function() {
      switch(this.corner) {
        case "top-right":
          return {
            top: "3px",
            right: "1px"
          };
        case "top-left":
          return {
            top: "3px",
            left: "2px"
          };
        case "bottom-left":
          return {
            bottom: "4px",
            left: "2px"
          };
        case "bottom-right":
          return {
            bottom: "4px",
            right: "1px"
          };
      } 
    }
  }
}

</script>

<template>

<svg class="player-arrow" :style="arrowStyle" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 224 224">
  <g fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
    <path d="M0,224v-224h224v224z" fill="none"></path>
    <g fill="#aaaaaa">
      <path v-if="corner === 'top-right'" d="M28,28v18.66667h28c46.5042,0 84,37.4958 84,84v18.66667h-37.33333l46.66667,46.66667l46.66667,-46.66667h-37.33333v-18.66667c0,-56.5918 -46.07487,-102.66667 -102.66667,-102.66667z"></path>
      <path v-if="corner === 'bottom-left'" d="M74.66667,28l-46.66667,46.66667h37.33333v18.66667c0,56.5918 46.07487,102.66667 102.66667,102.66667h28v-18.66667h-28c-46.5042,0 -84,-37.4958 -84,-84v-18.66667h37.33333z"></path>
      <path v-if="corner === 'top-left'" d="M168,28c-56.5918,0 -102.66667,46.07487 -102.66667,102.66667v18.66667h-37.33333l46.66667,46.66667l46.66667,-46.66667h-37.33333v-18.66667c0,-46.5042 37.4958,-84 84,-84h28v-18.66667z"></path>
      <path v-if="corner === 'bottom-right'" d="M149.33333,28l-46.66667,46.66667h37.33333v18.66667c0,46.5042 -37.4958,84 -84,84h-28v18.66667h28c56.5918,0 102.66667,-46.07487 102.66667,-102.66667v-18.66667h37.33333z"></path>
    </g>
  </g>
</svg>

</template>

<style>

.player-arrow {
  position: absolute;
}

</style>