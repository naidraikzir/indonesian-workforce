<template>
  <div>
    <Map />
  </div>
</template>

<script>
import Map from '@/components/Map';

export default {
  name: 'app',

  components: {
    Map,
  },
};
</script>

<style lang="scss">
html {
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
</style>
