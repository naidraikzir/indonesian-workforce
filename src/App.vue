<template>
  <div>
    <Map
      :center="center"
      :pitch="pitch"
      :zoom="zoom"
    />
  </div>
</template>

<script>
import Map from '@/components/Map';

export default {
  name: 'app',

  components: {
    Map,
  },

  data: () => ({
    center: {
      latitude: -1,
      longitude: 119,
    },
    pitch: 45,
    zoom: 4.5,
  }),
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
