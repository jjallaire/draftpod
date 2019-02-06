

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

    <p class="small">
      Copyright &copy; 2019 <a href="https://github.com/jjallaire/draftpod/blob/master/AUTHORS">Draftpod</a>.
      <span class="footer-links">
        <a href="/guide#welcome/">About</a>
        <a href="/guide#faq/">FAQ</a>
        <a href="/guide#privacy/">Privacy</a>
        <a href="/guide#contact/">Contact</a>
        <a href="https://github.com/jjallaire/draftpod">GitHub</a>
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
  color: #ccc !important;
  margin-left: 15px;
  margin-right: 15px;
}

</style>
