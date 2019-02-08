

<script>


export default {
  name: 'SiteFooter',
}

</script>

<template>
  <footer class="site-footer text-muted">
    <p class="small">
      Draftpod is unofficial Fan Content permitted under the Wizards 
      <a href="https://company.wizards.com/fancontentpolicy">Fan Content Policy</a>. 
      The literal and graphical information  presented on this site about Magic: The Gathering, including card images, is copyright
      &copy; Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. This website is not produced by, endorsed by, supported by, 
      or affiliated with Wizards of the Coast.
    </p>
    <p class="small">
      Card ratings are derived from the P1P1 pick order lists published by
      <a href="https://www.draftaholicsanonymous.com">Draftaholics Anonymous</a>. 
      Card data is drawn from the <a href="https://scryfall.com/docs/api">Scryfall API</a>. 
      The Draftpod logo was designed by <a href="http://www.faithtoken.com/">Faithtoken</a> 
      and is used via the <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> license. 
      Material Design UI icons are &copy; 2014 Austin Andrews and &copy; 2014 Google.
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
