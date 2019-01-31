

<script>

import Spinner from 'vue-simple-spinner'

export default {
  name: 'MultiplayerPending',

  components: { Spinner }
}

</script>


<template>
  <div>
    <Spinner 
      message="Creating draft..." 
      size="medium" 
      line-fg-color="#62c462" 
      text-fg-color="#aaa"
    />
  </div>
</template>


<style>

</style>

