<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        document.addEventListener('drop', function(e) {
            e.preventDefault()
        }, false)
        document.addEventListener('dragover', function(e) {
            e.preventDefault()
        }, false)
    }
}
</script>
