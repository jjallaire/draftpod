

<script>

import CopyrightNoticeMd from './CopyrightNotice.md'

export default {
  name: 'SiteFooter',

  components: {
    CopyrightNoticeMd
  }
}

</script>

<template>
  <footer class="site-footer">
    <p class="small">
      <CopyrightNoticeMd />
    </p>
  </footer>
</template>

<style>

.site-footer {
  margin-top: 70px;
  margin-bottom: 50px;
}

.site-footer a {
  color: inherit;
}

</style>
