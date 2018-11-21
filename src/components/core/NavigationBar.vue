<template>
  <nav class="navbar navbar-dark navbar-expand-sm">

    <img class="navbar-logo" src="/images/logo.svg" />
    <span class="navbar-brand">
      <router-link class="text-light" to="/" exact>draftpod</router-link>
    </span>
    
    <slot><span class="navbar-text">Draft simulator for Magic the Gathering&trade;</span></slot>

    <ul class="navbar-nav ml-auto">
      <router-link tag="li" class="nav-item" active-class="active" to="/" exact>
        <a class="nav-link">Home</a>
      </router-link>
      <router-link tag="li" class="nav-item" active-class="active" to="/draft/">
        <a class="nav-link">Draft</a>
      </router-link>
      <router-link tag="li" class="nav-item" active-class="active" to="/about/">
        <a class="nav-link">About</a>
      </router-link>
    </ul>
    
    <a href="https://github.com/jjallaire/mtgdrafter">
      <img class="navbar-github-image" src="/images/github.png"/>
    </a>
  </nav>
</template>

<script>

export default {
  name: 'NavigationBar',
}
</script>

<style>

.navbar {
  border: 0;
  padding: 5px;
  z-index: 1000;
  background-image: linear-gradient(#484e55, #3A3F44 60%, #313539);
  background-repeat: no-repeat;
  background-color: transparent;
}

.navbar .nav-link {
  padding-top: 0.4rem;
  padding-bottom: 0.5rem;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255,255,255,0.7);
}

.navbar-dark .navbar-text {
  color: rgba(255,255,255,0.7);
}

.navbar .navbar-text .simple-svg-wrapper svg>path {
  fill: rgba(255,255,255,0.7);
}



.navbar .nav-link.icon-link {
  padding-top: 0;
  padding-bottom: 0.2rem;
}

.navbar .navbar-brand {
  font-size: 1rem;
  font-weight: 400;
  padding-top: 0;
  padding-bottom: 0 ;
  padding-left: 0.3rem;
}

.navbar .navbar-brand a:hover {
  text-decoration: none;
  color: #fff;
}

.navbar .navbar-logo {
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  height: 26px;
}

.navbar .navbar-github-image {
  height: 18px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 3px;
}

.navbar .navbar-text {
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 1em;
}

.navbar .nav-item .material-design-icon {
  font-size: 1.3rem;
  line-height: inherit;
}

.navbar .simple-svg-wrapper {
  display: inline-block;
}

.navbar .navbar-set-icon {
  padding-bottom: 6px;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
}

.navbar .navbar-text .simple-svg-wrapper svg {
  height: 16px;
  width: auto;
}

</style>
