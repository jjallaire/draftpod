

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
  <footer class="site-footer text-muted">
    <p class="small">
      <CopyrightNoticeMd />
    </p>

    <p class="small">
      All other content &copy; 2019 Draftpod. All rights reserved.
      <span class="footer-links">
        <a href="/guide#welcome/">About</a>
        <a href="/guide#faq/">FAQ</a>
        <a href="/guide#privacy/">Privacy</a>
        <a href="/guide#contact/">Contact</a>
      </span>
    </p>
  </footer>
</template>

<style>

.site-footer {
  margin-top: 50px;
  margin-bottom: 50px;
}

.site-footer a {
  color: inherit !important;
}

.site-footer .footer-links a {
  color: #999 !important;
  margin-left: 30px;
}

</style>
