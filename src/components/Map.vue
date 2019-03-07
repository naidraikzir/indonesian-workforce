<template>
  <div
    class="map"
    ref="map"
  />
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  props: {
    center: {
      type: Object,
      default: () => ({
        latitude: 0,
        longitude: 0,
      }),
      validator: value =>
        value.hasOwnProperty('latitude') && value.hasOwnProperty('longitude'),
    },
    pitch: {
      type: Number,
      default: 0,
    },
    zoom: {
      type: Number,
      default: 3,
    },
    loadCallback: {
      type: Function,
      default: () => {},
    },
  },

  data: () => ({
    map: null,
  }),

  mounted() {
    this.mountMap();
  },

  beforeUpdate() {
    this.destroy();
  },

  beforeDestroy() {
    this.destroy();
  },

  methods: {
    mountMap() {
      const { latitude, longitude } = this.center;
      mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        pitch: this.pitch,
        zoom: this.zoom,
      });
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.loadCallback(this.map);
      });
    },
    destroy() {
      this.map = this.$options.data.map;
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}
</style>
