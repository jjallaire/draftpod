<template>
  <span :aria-hidden="decorative"
        :aria-label="title"
        class="material-design-icon dock-bottom-icon"
        role="img"
  >
    <svg :fill="fill_color"
         class="material-design-icon__svg"
         :width="size"
         :height="size"
         viewBox="0 0 24 24"
    >
      <path d="M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M20 13H4V6H20Z">
        <title>{{ title }}</title>
      </path>
    </svg>
  </span>
</template>

<script>
export default {
  name: "DockBottomIcon",
  props: {
    title: {
      type: String,
      default: "DockBottom"
    },
    decorative: {
      type: Boolean,
      default: false
    },
    fill_color: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
}
</script>
