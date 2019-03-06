

<script>


export default {
  name: 'SiteFooter',
}

</script>

<template>
  <footer class="site-footer text-muted">
    <p class="small">
      Magic: The Gathering is a Trademark of Wizards of the Coast LLC, a subsidiary of Hasbro, Inc. 
      The information presented on this site about Magic: The Gathering, both literal and graphical, 
      is copyrighted by Wizards of the Coast. This website is not produced, endorsed, supported, 
      or affiliated with Wizards of the Coast.
    </p>
   
    <p class="small">
      &copy; 2019 Draftpod. All rights reserved.
      <span class="footer-links">
        <a href="/guide#welcome/">About</a>
        <a href="/guide#faq/">FAQ</a>
        <a href="/guide#privacy/">Privacy</a>
        <a href="/guide#contact/">Contact</a>
        <a href="https://twitter.com/DraftpodMTG">Twitter</a>
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
  margin-left: 25px;
}

</style>
