<template>
  <div id="app">
    <KeepAlive>
      <router-view/>
  </KeepAlive>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  mounted() {
    this.$router.push('/login')
  },
}
</script>

<style>
#app {
  height: 100%;
}
</style>
